import { createContext, useContext } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { Position } from "./grid/position";
import { Level, Selection } from "./level";
import { Command, Program } from "./program";

type DataBattle = Level & { selection: Selection };
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
		selection: null,
	});
	const actions = {
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
		// healProgram This is gonna suck
		toggleSolid(pos: Position) {
			setDataBattle("solid", pos.sectorIndex, (solid) => !solid);
		},
	};
	return [dataBattle, actions] as const;
};
