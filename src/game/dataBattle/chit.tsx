import { Position } from "./grid/position";
import { gridUnitSize } from "./grid/segment";
import { Program } from "./program";
import { Actions, useDataBattle } from "./store";

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
	onLandOn?: (
		this: Chit,
		program: Program,
		actions: Actions
	) => boolean | void;
}

export interface Chit extends ChitConfig {
	// id is here, but is instead a UID
	pos: Position;
	onLandOn?: ChitInstanceDefinition["onLandOn"];
}

export interface ChitProps {
	chit: Chit;
}
export const ChitComponent = (p: ChitProps) => {
	const [, { setSelection }] = useDataBattle();
	const { x, y } = p.chit.pos;

	return (
		<image
			x={x * gridUnitSize}
			y={y * gridUnitSize}
			href={p.chit.icon}
			onClick={() => setSelection({ chit: p.chit })}
		/>
	);
};
