import { Position } from "./grid/position";

type Target = "void" | "vacant" | "enemy" | "ally" | "self";

export type Command = {
	name: string;
	desc: string;
	range: number;
	targets: Target[];
	usable?: (self: Program) => boolean;
	effect: (target: Program, self: Program, tile: any) => void;
}

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
	id: string;
	slug: [number, number][];
}

export class Program implements ProgramBase {
	slug: Position[];
	harm;
	heal;
	private config: ProgramConfig;
	private configMods: ProgramBase;

	name: string;
	desc: string;
	icon: string;
	speed: number;
	maxSize: number;
	color: string;
	commands: Command[];

	constructor(slug: Position[], config: ProgramConfig, configMods: ProgramBase = {}) {
		Object.assign(this, { slug, config, configMods });

		["name", "desc", "icon", "speed", "maxSize", "color", "commands"].forEach(prop =>
			Object.defineProperty(this, prop, {
				get: () => this.configMods[prop] ?? this.config[prop],
			}),
		);
	}
}
