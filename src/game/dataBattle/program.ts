import { Chit } from "./chit";
import { Position } from "./grid/position";

type Target = "void" | "vacant" | "enemy" | "ally" | "self";

export type Command = {
	name: string;
	desc: string;
	range: number;
	targets: Target[];
	usable?: (self: Program) => boolean;
	effect: (target: Program, self: Program, tile: any) => void;
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
}

export interface Program extends ProgramConfig {
	// id is here, but is instead a UID
	slug: Position[];
}

export function isProgram(chit: Chit | Program): chit is Program {
	return chit.hasOwnProperty("slug");
}
