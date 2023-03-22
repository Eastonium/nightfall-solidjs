import { For } from "solid-js";
import { Chit } from "./chit";
import { Position } from "./grid/position";
import { Segment } from "./grid/segment";
import { Actions, useDataBattle } from "./store";

type Target = "enemy" | "ally" | "self" | "void" | "solid";
type EffectType = "harm" | "heal" | "other";

export type Command = {
	name: string;
	desc: string;
	range: number;
	targets: Target[];
	effectType: EffectType;
	usable?: (this: Program) => boolean;
	effect: (
		this: Program,
		position: Position,
		target: Program | null,
		actions: Actions
	) => void;
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

export function isProgram(
	chit: Chit | Program | ProgramConfig
): chit is Program | ProgramConfig {
	return chit.hasOwnProperty("commands");
}
export function isProgramInstance(
	program: Chit | Program | ProgramConfig
): program is Program {
	return program.hasOwnProperty("slug");
}

export const ProgramComponent = (p: { program: Program }) => {
	const [, { setSelection }] = useDataBattle();
	const sortedSlug = () => [...p.program.slug].sort(Position.compare);

	return (
		<g onClick={() => setSelection({ chit: p.program, command: null })}>
			<For each={sortedSlug()}>
				{(pos) => {
					const { column, row } = pos;
					const posRight = pos.clone(1, 0);
					const posDown = pos.clone(0, 1);
					return (
						<Segment
							{...{ column, row }}
							color={p.program.color}
							icon={
								pos === p.program.slug[0]
									? p.program.icon
									: null
							}
							connectRight={
								posRight &&
								sortedSlug().find(posRight.equals) != null
							}
							connectDown={
								posDown &&
								sortedSlug().find(posDown.equals) != null
							}
						/>
					);
				}}
			</For>
		</g>
	);
};

