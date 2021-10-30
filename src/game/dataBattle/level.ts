import { findChitConfig, findProgramConfig } from "game";
import { Chit, ChitInstanceDefinition } from "./chit";
import { Position } from "./grid/position";
import { Program, ProgramInstanceDefinition } from "./program";

export type LevelDefinition = {
	orientation: "orthogonal"; // | "hexagonal";
	width: number;
	height: number;
	solid: string;
	style: string;
	styleKey: { [char: string]: string };
	chits: ChitInstanceDefinition[];
	programs: ProgramInstanceDefinition[];
};
export type Level = ReturnType<typeof processLevel>;

export const processLevel = ({ styleKey, ...level }: LevelDefinition) => {
	return {
		...level,
		solid: level.solid
			.replaceAll(/\s+/g, "")
			.split("")
			.map(char => char === "⬜"),
		style: level.style
			.replaceAll(/\s+/g, "")
			.split("")
			.map(char => styleKey[char]),
		chits: level.chits.map(({ id, pos, ...mods }) => {
			const config = findChitConfig(id);
			if (!config) throw Error(`Could not find chit config for id: ${id}`);

			return new Chit(new Position(pos, level.width, level.height), config, mods);
		}),
		programs: level.programs.map(({ id, slug, ...mods }) => {
			const config = findProgramConfig(id);
			if (!config) throw Error(`Could not find program config for id: ${id}`);

			return new Program(
				slug.map(pos => new Position(pos, level.width, level.height)),
				config,
				mods,
			);
		}),
	};
};
