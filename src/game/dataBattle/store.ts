import { getChitConfig } from "game/game";
import {
	createContext,
	createEffect,
	createUniqueId,
	untrack,
	useContext,
} from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Chit } from "./chit";
import { Position } from "./grid/position";
import { Level } from "./level";
import {
	Command,
	isProgram,
	isProgramInstance,
	Program,
	ProgramConfig,
} from "./program";

type BattlePhase =
	| { name: "setup"; team: number }
	| { name: "turn"; team: number }
	| { name: "end"; winner: number };

export type Selection =
	| null
	| { chit: Chit; command: null }
	| { chit: Program | ProgramConfig; command: Command | null };

type DataBattle = Level & {
	phase: BattlePhase;
	selection: Selection;
	collectedCredits: number;
};
export type Actions = ReturnType<typeof createDataBattleStore>[1];

export const DataBattleContext =
	createContext<ReturnType<typeof createDataBattleStore>>();

export const useDataBattle = () => {
	const dataBattle = useContext(DataBattleContext);
	if (!dataBattle)
		throw Error(
			"useDataBattle must be used with a DataBattleContext provider"
		);
	return dataBattle;
};

export const createDataBattleStore = (level: Level) => {
	const [dataBattle, setDataBattle] = createStore<DataBattle>({
		...level,
		phase: { name: "setup", team: 0 },
		selection: null,
		collectedCredits: 0,
	});

	// clear selection if selected program dies
	createEffect(() => {
		if (
			dataBattle.selection &&
			isProgramInstance(dataBattle.selection.chit) &&
			dataBattle.selection.chit.slug.length === 0
		) {
			setDataBattle("selection", null);
		}
	});

	// Select first upload zone or program for new team on their turn
	createEffect(() => {
		if (dataBattle.phase.name === "end") return;
		const team = dataBattle.phase.team;
		untrack(() => {
			if (dataBattle.phase.name === "setup") {
				const uploadZone = dataBattle.uploadZones.find(
					(uz) => uz.team === team
				);
				if (!uploadZone) return;
				setDataBattle("selection", {
					chit: {
						pos: uploadZone.pos,
						...getChitConfig("nightfall:upload_zone")!,
					},
					command: null,
				});
			} else {
				const program = dataBattle.programs.find(
					(prog) =>
						prog.team === team &&
						!prog.usedAction &&
						prog.slug.length > 0
				);
				if (!program) return;
				setDataBattle("selection", { chit: program, command: null });
			}
		});
	});

	const selectors = {
		dataBattle,
		selectionPosition: () =>
			dataBattle.selection &&
			(isProgram(dataBattle.selection.chit)
				? isProgramInstance(dataBattle.selection.chit)
					? dataBattle.selection.chit.slug[0]
					: null
				: dataBattle.selection.chit.pos),
	};

	const actions = {
		selectListedProgram(program: ProgramConfig) {
			const selectionPos = selectors.selectionPosition();

			if (
				selectionPos &&
				dataBattle.uploadZones.find((uz) => uz.pos.equals(selectionPos))
			) {
				setDataBattle(
					"uploadZones",
					(uz) => uz.pos.equals(selectionPos),
					{ program }
					// program is not from store, do like this instead of ...["program", program] to avoid corrupting it
				);
				setDataBattle("selection", {
					chit: { team: 0, slug: [selectionPos], ...program },
					command: null,
				});
			} else {
				setDataBattle("selection", { chit: program, command: null });
			}
		},
		clearUploadZone() {
			const selectionPos = selectors.selectionPosition();
			if (!selectionPos) return;
			setDataBattle(
				"uploadZones",
				(uz) => uz.pos.equals(selectionPos),
				"program",
				null
			);
			setDataBattle("selection", {
				chit: {
					pos: selectionPos,
					...getChitConfig("nightfall:upload_zone")!,
				},
			});
		},
		endSetup() {
			setDataBattle(
				produce((dataBattle) => {
					dataBattle.uploadZones.forEach(
						({ team, pos, program: pc }) => {
							if (!pc) return;
							const program: Program = {
								...pc,
								id: createUniqueId(),
								slug: [pos],
								team,
								usedSpeed: 0,
								usedAction: false,
							};
							dataBattle.programs.push(program);
							dataBattle.mapPrograms[pos.sectorIndex] = program;
						}
					);
					dataBattle.uploadZones = [];

					dataBattle.selection = null;
					dataBattle.phase = { name: "turn", team: 0 };
				})
			);
		},
		setSelection(selection: Selection) {
			// Check if different program is selected and if the current selection has moved
			if (
				dataBattle.selection &&
				dataBattle.selection.chit.id !== selection?.chit.id &&
				isProgramInstance(dataBattle.selection.chit) &&
				dataBattle.selection.chit.usedSpeed > 0
			) {
				setDataBattle(
					"programs",
					(prog) => prog.id === dataBattle.selection?.chit.id,
					"usedAction",
					true
				);
			}
			setDataBattle("selection", selection);
		},
		moveProgram(program: Program, pos: Position) {
			setDataBattle(
				produce((dataBattle) => {
					const program2 = dataBattle.programs.find(
						(program2) => program2.id === program.id
					)!;

					// Extend to new position
					program2.slug = [
						pos,
						...program.slug.filter((pos2) => !pos2.equals(pos)),
					];
					dataBattle.mapPrograms[pos.sectorIndex] = program2;

					// Trim to keep max size
					program2.slug
						.splice(program2.maxSize, Infinity)
						.forEach(
							(pos) =>
								(dataBattle.mapPrograms[pos.sectorIndex] = null)
						);

					// Increased speed used this turn
					program2.usedSpeed++;
					// If all speed is used, auto-select first command
					if (program2.usedSpeed === program2.speed) {
						dataBattle.selection = {
							chit: program2,
							command: program2.commands[0] ?? null,
						};
					}

					const chit = dataBattle.chits.find((chit) =>
						chit.pos.equals(pos)
					);
					if (chit) {
						chit.onLandOn?.(program2, actions);
						dataBattle.chits = dataBattle.chits.filter(
							(c) => c.id !== chit.id
						);
					}
				})
			);
		},
		runProgramCommand(
			sourceProg: Program,
			...cmd: // cheesy overload
			| [null]
				| [
						command: Command,
						targetPos: Position,
						targetProg: Program | null
				  ]
		) {
			if (cmd[0]) {
				const [command, targetPos, targetProg] = cmd;
				command.effect.call(sourceProg, targetPos, targetProg, actions);
			}
			setDataBattle(
				"programs",
				(prog) => prog.id === sourceProg.id,
				"usedAction",
				true
			);

			if (dataBattle.phase.name !== "turn") return;
			// Find next program (in order) and select it
			const progIndex = dataBattle.programs.findIndex(
				(prog) => prog.id === sourceProg.id
			);
			for (
				let i = (progIndex + 1) % dataBattle.programs.length;
				i !== progIndex;
				i = (i + 1) % dataBattle.programs.length
			) {
				const program = dataBattle.programs[i];
				if (
					program.team === dataBattle.phase.team &&
					!program.usedAction &&
					program.slug.length > 0
				) {
					setDataBattle("selection", {
						chit: program,
						command: null,
					});
					return;
				}
			}
			// If no program was found, clear selection and switch to next team's turn
			setDataBattle("selection", null);
			const nextTeam =
				dataBattle.teams[
					(dataBattle.teams.indexOf(dataBattle.phase.team) + 1) %
						dataBattle.teams.length
				];
			setDataBattle("programs", (prog) => prog.team === nextTeam, {
				usedSpeed: 0,
				usedAction: false,
			});
			setDataBattle("phase", { name: "turn", team: nextTeam });
		},
		harmProgram(program: Program, amount: number) {
			setDataBattle(
				produce((dataBattle) => {
					const program2 = dataBattle.programs.find(
						(program2) => program2.id === program.id
					)!;
					program2.slug
						.splice(-amount, amount)
						.forEach(
							(pos) =>
								(dataBattle.mapPrograms[pos.sectorIndex] = null)
						);
				})
			);
		},
		healProgram(program: Program, amount: number) {
			setDataBattle(
				produce((dataBattle) => {
					const program2 = dataBattle.programs.find(
						(program2) => program2.id === program.id
					)!;
					const possiblePositions: number[] = [];
					const grabAround = (slugPos: Position) => {
						[
							[0, -1],
							[-1, 0],
							[1, 0],
							[0, 1],
						].forEach((offset) => {
							const { sectorIndex } = slugPos.clone(...offset);
							if (
								dataBattle.solid[sectorIndex] &&
								!dataBattle.mapPrograms[sectorIndex] &&
								!possiblePositions.includes(sectorIndex)
							) {
								possiblePositions.push(sectorIndex);
							}
						});
					};
					program2.slug.forEach(grabAround);

					for (let i = 0; i < amount; i++) {
						if (
							!possiblePositions.length ||
							program2.slug.length >= program2.maxSize
						) {
							break;
						}
						const randomPos = program2.slug[0].new(
							possiblePositions.splice(
								Math.floor(
									Math.random() * possiblePositions.length
								),
								1
							)[0]
						);
						program2.slug.push(randomPos);
						dataBattle.mapPrograms[randomPos.sectorIndex] =
							program2;
						grabAround(randomPos);
					}
				})
			);
		},
		modProgram(
			program: Program,
			property: "speed" | "maxSize",
			mutator: (current: number) => number
		) {
			setDataBattle(
				"programs",
				(program2) => program2.id === program.id,
				property,
				mutator
			);
		},
		toggleSolid(pos: Position) {
			setDataBattle("solid", pos.sectorIndex, (solid) => !solid);
		},
		collectCredits(amount: number) {
			setDataBattle("collectedCredits", (credits) => credits + amount);
		},
		endGame(winningTeam: number) {
			setDataBattle("phase", { name: "end", winner: winningTeam });
		},
	};
	return [selectors, actions] as const;
};
