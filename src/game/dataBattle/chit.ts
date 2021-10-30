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
	id: string;
	pos: [number, number];
}

export class Chit implements ChitBase {
	pos: Position;
	private config: ChitConfig;
	private configMods: ChitBase;

	name: string;
	desc: string;
	icon: string;

	constructor(pos: Position, config: ChitConfig, configMods: ChitBase = {}) {
		Object.assign(this, { pos, config, configMods });

		["name", "desc", "icon"].forEach(prop =>
			Object.defineProperty(this, prop, {
				get: () => this.configMods[prop] ?? this.config[prop],
			}),
		);
	}
}
