import { Chit } from "./chit";
import { Position } from "./grid/position";

type Target = "enemy" | "ally" | "self" | "void" | "solid";
type EffectType = "harm" | "heal" | "other";

export type Command = {
	name: string;
	desc: string;
	range: number;
	targets: Target[];
	effectType: EffectType;
	usable?: (this: Program) => boolean;
	effect: (this: Program, position: Position, target: Program | null) => void;
};

interface ProgramBase {
	name?: string;
	desc?: string;
	icon?: string;
	speed?: number;
	maxSize?: number;
	color?: string;
	commands?: Command[];
}
export interface ProgramConfig extends Required<ProgramBase> {
	id: string;
}
export interface ProgramInstanceDefinition extends ProgramBase {
	id: string; // For referencing a config
	slug: [number, number][];
	team: number;
}

export interface Program extends ProgramConfig {
	// id is here, but is instead a UID
	slug: Position[];
	team: number;
}

export function isProgram(chit: Chit | Program): chit is Program {
	return chit.hasOwnProperty("slug");
}
