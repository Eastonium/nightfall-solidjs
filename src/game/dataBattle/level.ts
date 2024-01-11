import { getChitConfig, getProgramConfig } from "game/game";
import { createUniqueId } from "solid-js";
import { Chit, ChitInstanceDefinition } from "./chit";
import { Position } from "./grid/position";
import { Program, ProgramInstanceDefinition } from "./program";
import { Actions } from "./store";
import { UploadZone, UploadZoneInstanceDefinition } from "./uploadZone";

export type TeamId = number;
export type Team = { id: TeamId, ai?: boolean }

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
	teams: Team[];
	creditReward: number;
	onTeamEliminated: (
		team: TeamId,
		remainingTeams: TeamId[],
		actions: Actions
	) => void;
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
				usedSpeed: 0,
				usedAction: false,
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
				program: null,
			})
		),
		mapPrograms,
	};
};
