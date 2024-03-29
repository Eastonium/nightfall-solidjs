import { getChitConfig } from "game/game";
import {
	Accessor,
	batch,
	createContext,
	createEffect,
	createSignal,
	createUniqueId,
	Setter,
	untrack,
	useContext,
} from "solid-js";
import {
	createStore,
	produce,
	reconcile,
	SetStoreFunction,
	unwrap,
} from "solid-js/store";
import { Chit } from "./chit";
import { Position } from "./grid/position";
import { Level, Team, TeamId } from "./level";
import { Command, isProgramInstance, Program, ProgramConfig } from "./program";
import cloneDeep from "lodash.clonedeep";
import { executeAiTurn } from "./ai";
import { wait } from "utils";
import { timing } from "./timings";

type BattlePhase =
	| { name: "setup"; turn: number; team: Team } // Setup might have turns in the future?
	| { name: "turn"; turn: number; team: Team }
	| { name: "end"; winner: TeamId };

export type Selection =
	| null
	| { chit: Chit; program?: never; command?: never }
	| { chit?: never; program: Program | ProgramConfig; command?: Command };

type DataBattle = Level & {
	id: string;
	phase: BattlePhase;
	selection: Selection;
	creditsCollected: number;
};
export type Selectors = ReturnType<typeof createSelectors>;
export type Actions = ReturnType<typeof createActions>;

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
		id: createUniqueId(),
		phase: { name: "setup", turn: 1, team: level.teams[0] },
		selection: null,
		creditsCollected: 0,
	});
	const [rollbackStates, setRollbackStates] = createSignal<DataBattle[]>([]);
	const selectors = createSelectors(dataBattle, rollbackStates);
	const actions = createActions(selectors, setDataBattle, setRollbackStates);

	// Run AI turn or select first upload zone or program for new player turn
	createEffect(() => {
		if (dataBattle.phase.name !== "turn") return;

		dataBattle.phase.turn;
		const team = dataBattle.phase.team;

		if (team.ai) {
			untrack(() => executeAiTurn(selectors, actions));
			return;
		}

		untrack(() => {
			const program = dataBattle.programs.find(
				(prog) =>
					prog.team === team.id &&
					!prog.usedAction &&
					prog.slug.length > 0
			);
			if (!program) return;
			actions.setSelection({ program });
		});
	});

	return [selectors, actions] as const;
};
const createSelectors = (
	dataBattle: DataBattle,
	rollbackStates: Accessor<DataBattle[]>
) => ({
	dataBattle,
	selectionPosition: () =>
		dataBattle.selection &&
		(dataBattle.selection.chit?.pos ??
			(isProgramInstance(dataBattle.selection.program)
				? dataBattle.selection.program.slug[0]
				: null)),
	rollbackStates,
});

const createActions = (
	{ dataBattle, selectionPosition, rollbackStates }: Selectors,
	setDataBattle: SetStoreFunction<DataBattle>,
	setRollbackStates: Setter<DataBattle[]>
) => {
	const actions = {
		// #hoisted
		selectListedProgram,
		clearUploadZone,
		endSetup,
		setSelection,
		moveProgram,
		runProgramCommand,
		harmProgram,
		healProgram,
		modProgram,
		endProgramTurn,
		toggleSolid,
		collectCredits,
		rollbackState,
		switchToNextTeam,
		endGame,
	};

	function selectListedProgram(program: ProgramConfig) {
		if (dataBattle.phase.name !== "setup") return;
		const selectionPos = selectionPosition();
		const currentTeamId = dataBattle.phase.team.id;

		if (
			selectionPos &&
			dataBattle.uploadZones.find(
				(uz) => uz.team === currentTeamId && uz.pos.equals(selectionPos)
			)
		) {
			setDataBattle(
				"uploadZones",
				(uz) => uz.pos.equals(selectionPos),
				{ program }
				// program is not from store, do like this instead of ...["program", program] to avoid corrupting it
			);
			setSelection({
				program: {
					team: currentTeamId,
					slug: [selectionPos],
					...program,
				},
			});
		} else {
			setSelection({ program });
		}
	}

	function clearUploadZone() {
		const selectionPos = selectionPosition();
		if (!selectionPos) return;
		setDataBattle(
			"uploadZones",
			(uz) => uz.pos.equals(selectionPos),
			"program",
			null
		);
		setSelection({
			chit: {
				pos: selectionPos,
				...getChitConfig("nightfall:upload_zone")!,
			},
		});
	}

	function endSetup() {
		setDataBattle(
			produce((dataBattle) => {
				dataBattle.uploadZones.forEach(({ team, pos, program: pc }) => {
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
				});
				dataBattle.uploadZones = [];

				dataBattle.selection = null;
				dataBattle.phase = {
					name: "turn",
					turn: 1,
					team: dataBattle.teams[0],
				};
			})
		);
	}

	function setSelection(selection: Selection) {
		// Check if different program is selected and if the currently selected program has moved
		if (
			dataBattle.selection &&
			dataBattle.selection.program?.id !== selection?.program?.id &&
			isProgramInstance(dataBattle.selection.program) &&
			dataBattle.selection.program.usedSpeed > 0
		) {
			const programId = dataBattle.selection.program.id;
			// Prevent it from moving again (can be rolled back)
			endProgramTurn(programId);
		}

		setDataBattle(
			"selection",
			selection
				? {
						chit: undefined,
						program: undefined,
						command: undefined,
						...selection,
				  }
				: null
		);
	}

	function moveProgram(program: Program, pos: Position) {
		setDataBattle(
			produce((dataBattle) => {
				const program2 = dataBattle.programs.find(
					(program2) => program2.id === program.id
				)!;

				// If this is the first move for this program, save rollback state
				if (
					dataBattle.phase.name === "turn" &&
					!dataBattle.phase.team.ai &&
					program2.usedSpeed === 0
				) {
					setRollbackStates((prev) => [
						cloneDeep(unwrap(dataBattle)),
						...prev,
					]);
				}

				// Extend to new position
				program2.slug = [
					pos,
					...program2.slug.filter((pos2) => !pos2.equals(pos)),
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
				if (program2.usedSpeed >= program2.speed) {
					dataBattle.selection = {
						program: program2,
						command: program2.commands[0] ?? null,
					};
				}

				const chit = dataBattle.chits.find((chit) =>
					chit.pos.equals(pos)
				);
				if (chit) {
					if (chit.onLandOn?.(program2, actions)) {
						dataBattle.chits = dataBattle.chits.filter(
							(c) => c.id !== chit.id
						);
					}
				}
			})
		);
	}

	async function runProgramCommand(
		sourceProg: Program,
		...cmd:
			| [null]
			| [
					command: Command,
					targetPos: Position,
					targetProg: Program | null
			  ]
	) {
		if (cmd[0]) {
			// Remove rollback state on running a command
			setRollbackStates([]);
			const [command, targetPos, targetProg] = cmd;
			await command.effect.call(
				sourceProg,
				targetPos,
				targetProg,
				actions
			);
		}
		endProgramTurn(sourceProg.id);

		if (dataBattle.phase.name !== "turn" || dataBattle.phase.team.ai)
			return;
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
				program.team === dataBattle.phase.team.id &&
				!program.usedAction &&
				program.slug.length > 0
			) {
				setSelection({ program });
				return;
			}
		}
		// No program found. Clear selection, and switch to next team's turn
		setSelection(null);
		switchToNextTeam();
	}

	async function harmProgram(programId: Program, amount: number) {
		const program = dataBattle.programs.find(
			(program) => program.id === programId.id
		)!;
		const initialLength = program.slug.length;
		for (let i = 0; i < Math.min(amount, initialLength); i++) {
			batch(() => {
				setDataBattle(
					"mapPrograms",
					program.slug[program.slug.length - 1].sectorIndex,
					null
				);
				setDataBattle(
					"programs",
					(prog) => prog.id === program.id,
					"slug",
					(slug) => slug.slice(0, -1)
				);
			});
			await wait(timing.programHurtCellDeletionDelay);
		}

		// If dead
		if (!program.slug.length) {
			// Clear selection if harmed program was selected
			if (dataBattle.selection?.program?.id === program.id) {
				setSelection(null);
			}

			if (!dataBattle.onTeamEliminated) return;
			// Check if whole team is eliminated
			const teamsAlive = new Set<number>();
			dataBattle.programs.forEach(
				(program) => program.slug.length && teamsAlive.add(program.team)
			);
			if (teamsAlive.has(program.team)) return; // Team wasn't eliminated

			dataBattle.onTeamEliminated(program.team, [...teamsAlive], actions);
		}
	}

	async function healProgram(programId: Program, amount: number) {
		const program = dataBattle.programs.find(
			(program2) => program2.id === programId.id
		)!;
		const possiblePositions: number[] = [];
		const grabAround = (slugPos: Position) => {
			slugPos.getSurroundingSectorIndexes().forEach((sectorIndex) => {
				if (
					dataBattle.solid[sectorIndex] &&
					!dataBattle.mapPrograms[sectorIndex] &&
					!possiblePositions.includes(sectorIndex)
				) {
					possiblePositions.push(sectorIndex);
				}
			});
		};
		program.slug.forEach(grabAround);

		for (let i = 0; i < amount; i++) {
			if (
				!possiblePositions.length ||
				program.slug.length >= program.maxSize
			) {
				break;
			}
			const randomPos = program.slug[0].new(
				possiblePositions.splice(
					Math.floor(Math.random() * possiblePositions.length),
					1
				)[0]
			);

			batch(() => {
				setDataBattle(
					"programs",
					(prog) => prog.id === program.id,
					"slug",
					(slug) => [...slug, randomPos]
				);
				setDataBattle("mapPrograms", randomPos.sectorIndex, program);
			});
			await wait(timing.programHealCellAdditionDelay);
			grabAround(randomPos);
		}
	}

	function modProgram(
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
	}

	function endProgramTurn(programId: Program["id"]) {
		setDataBattle("programs", (prog) => prog.id === programId, {
			usedSpeed: Infinity, // Prevent speed-adding programs from letting it move again
			usedAction: true,
		});
	}

	function toggleSolid(pos: Position) {
		setDataBattle("solid", pos.sectorIndex, (solid) => !solid);
	}

	function collectCredits(amount: number) {
		setDataBattle("creditsCollected", (credits) => credits + amount);
	}

	function rollbackState() {
		if (rollbackStates().length < 1) return;
		batch(() => {
			setDataBattle(reconcile(rollbackStates()[0]));
			setRollbackStates(
				([_restoredState, ...remainingStates]) => remainingStates
			);
			// Do some manual restoration of the chit/program object reference
			if (dataBattle.selection?.chit) {
				setSelection({
					chit: dataBattle.chits.find(
						(chit) => chit.id === dataBattle.selection!.chit!.id
					)!,
				});
			} else if (dataBattle.selection?.program) {
				setSelection({
					program: dataBattle.programs.find(
						(prog) => prog.id === dataBattle.selection!.program!.id
					)!,
				});
			}
		});
	}

	function switchToNextTeam() {
		if (dataBattle.phase.name === "end") return;

		const currentTeamId = dataBattle.phase.team.id;
		// Remove all rollback states and reset used speed and action
		setRollbackStates([]);
		setDataBattle("programs", (prog) => prog.team === currentTeamId, {
			usedSpeed: 0,
			usedAction: false,
		});

		const currentTeamIndex = dataBattle.teams.findIndex(
			(team) => team.id === currentTeamId
		);
		let nextTeamIndex = (currentTeamIndex + 1) % dataBattle.teams.length;
		while (
			!dataBattle.programs.find(
				(program) =>
					program.team === dataBattle.teams[nextTeamIndex].id &&
					program.slug.length > 0
			)
		) {
			nextTeamIndex = (nextTeamIndex + 1) % dataBattle.teams.length;
		}

		setDataBattle("phase", {
			// Increment the turn number if the next team is not later in the team queue
			turn:
				currentTeamIndex <= nextTeamIndex
					? dataBattle.phase.turn + 1
					: dataBattle.phase.turn,
			team: dataBattle.teams[nextTeamIndex],
		});
	}

	function endGame(winningTeam: TeamId) {
		setDataBattle("phase", { name: "end", winner: winningTeam });
	}

	return actions;
};
