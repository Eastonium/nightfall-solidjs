import { Position } from "./grid/position";

interface ChitBase {
	name?: string;
	desc?: string;
	icon?: string;
}
export interface ChitConfig extends Required<ChitBase> {
	id: string;
}
export interface ChitInstanceDefinition extends ChitBase {
	id: string; // For referencing a config
	pos: [number, number];
}

export interface Chit extends ChitConfig {
	// id is here, but is instead a UID
	pos: Position;
}
