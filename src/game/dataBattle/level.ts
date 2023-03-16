import { findChitConfig, findProgramConfig } from "game";
import { createUniqueId } from "solid-js";
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
	const mapPrograms: (Program | null)[] = Array(
		level.width * level.height
	).fill(null);

	return {
		...level,
		solid: level.solid
			.replaceAll(/\s+/g, "") // Strip whitespace
			.split("")
			.map((char) => char === "⬜"),
		style: level.style
			.replaceAll(/\s+/g, "") // Strip whitespace
			.split("")
			.map((char) => styleKey[char]),
		chits: level.chits.map(({ id, pos, ...mods }): Chit => {
			const config = findChitConfig(id);
			if (!config)
				throw Error(`Could not find chit config for id: ${id}`);

			return {
				...config,
				...mods,
				id: createUniqueId(),
				pos: new Position(pos, level.width, level.height),
			};
		}),
		programs: level.programs.map(({ id, slug, ...mods }) => {
			const config = findProgramConfig(id);
			if (!config)
				throw Error(`Could not find program config for id: ${id}`);

			const program: Program = {
				...config,
				...mods,
				id: createUniqueId(),
				slug: slug.map(
					(pos) => new Position(pos, level.width, level.height)
				),
			};
			program.slug.forEach(
				(pos) => (mapPrograms[pos.sectorIndex] = program)
			);
			return program;
		}),
		// mapPrograms,
	};
};
