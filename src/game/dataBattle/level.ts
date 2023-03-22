import { getChitConfig, getProgramConfig } from "game/game";
import { createUniqueId } from "solid-js";
import { Chit, ChitInstanceDefinition } from "./chit";
import { Position } from "./grid/position";
import { Program, ProgramConfig, ProgramInstanceDefinition } from "./program";

type UploadZoneInstanceDefinition = {
	team: number;
	pos: [number, number];
};
export type UploadZone = {
	team: number;
	pos: Position;
	programId: string | null;
};
export type LevelDefinition = {
	orientation: "orthogonal"; // | "hexagonal";
	width: number;
	height: number;
	solid: string;
	style: string;
	styleKey: { [char: string]: string };
	chits: ChitInstanceDefinition[];
	programs: ProgramInstanceDefinition[];
	uploadZones: UploadZoneInstanceDefinition[];
	teams: number;
};
export type Level = ReturnType<typeof processLevel>;

export const processLevel = ({ styleKey, ...level }: LevelDefinition) => {
	const mapPrograms: (Program | null)[] = Array(
		level.width * level.height
	).fill(null);

	return {
		...level,
		solid: [
			...level.solid.replaceAll(/\s+/g, ""), // Strip whitespace
		].map((char) => char === "⬜"), // Spread string into array to avoid breaking emojis
		style: [
			...level.style.replaceAll(/\s+/g, ""), // Strip whitespace
		].map((char) => styleKey[char]), // Spread string into array to avoid breaking emojis
		chits: level.chits.map(({ id, pos, ...mods }): Chit => {
			const config = getChitConfig(id);
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
			const config = getProgramConfig(id);
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
		uploadZones: level.uploadZones.map(
			({ team, pos }): UploadZone => ({
				team,
				pos: new Position(pos, level.width, level.height),
				programId: null,
			})
		),
		mapPrograms,
	};
};
