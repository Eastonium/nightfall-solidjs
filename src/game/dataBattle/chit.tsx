import { Position } from "./grid/position";
import { gridUnitSize } from "./grid/segment";
import { useDataBattle } from "./store";

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

export const ChitComponent = (p: { chit: Chit }) => {
	const [, { setSelection }] = useDataBattle();
	const { column, row } = p.chit.pos;

	return (
		<image
			x={column * gridUnitSize}
			y={row * gridUnitSize}
			href={p.chit.icon}
			onClick={() => setSelection({ chit: p.chit, command: null })}
		/>
	);
};
