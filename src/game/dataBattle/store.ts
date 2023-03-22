import { createContext, createEffect, useContext } from "solid-js";
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

type DataBattle = Level & { phase: BattlePhase; selection: Selection };
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

	// createEffect(() => {
	// 	console.log(dataBattle.uploadZones[0].program?.name);
	// });

	const actions = {
		selectListedProgram(program: ProgramConfig) {
			const selectionPos =
				dataBattle.selection &&
				(isProgram(dataBattle.selection.chit)
					? isProgramInstance(dataBattle.selection.chit)
						? dataBattle.selection.chit.slug[0]
						: null
					: dataBattle.selection.chit.pos);
			if (
				selectionPos &&
				dataBattle.uploadZones.find((uz) => uz.pos.equals(selectionPos))
			) {
				setDataBattle(
					"uploadZones",
					(uz) => uz.pos.equals(selectionPos),
					"programId",
					"nightfall:" + program.id
				);
				setDataBattle("selection", {
					chit: { team: 0, slug: [selectionPos], ...program },
					command: null,
				});
			} else {
				setDataBattle("selection", { chit: program, command: null });
			}
		},
		endSetup() {
			setDataBattle(produce((dataBattle) => {}));
		},
		setSelection(selection: Selection) {
			setDataBattle("selection", selection);
		},
		setSelectedCommand(command: Command) {
			setDataBattle("selection", "command", command);
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
				})
			);
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
	};
	return [dataBattle, actions] as const;
};
