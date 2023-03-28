import { getTexture } from "game/game";
import { For, Show } from "solid-js";
import { Chit } from "./chit";
import { Position } from "./grid/position";
import { gridUnitSize, Segment } from "./grid/segment";
import { Team } from "./level";
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
	team: Team;
}

export interface Program extends ProgramConfig {
	// id is here, but is instead a UID
	slug: Position[];
	team: Team;
	usedSpeed: number;
	usedAction: boolean;
}

export function isProgramInstance(
	program: Program | ProgramConfig | null | undefined
): program is Program {
	return !!program?.hasOwnProperty("slug");
}

export const ProgramComponent = (p: { program: Program }) => {
	const [{ dataBattle }, { setSelection }] = useDataBattle();
	const sortedSlug = () => [...p.program.slug].sort(Position.compare);
	const headPos = () => p.program.slug[0];

	return (
		<g onClick={() => setSelection({ program: p.program })}>
			<For each={sortedSlug()}>
				{(pos) => {
					const { column, row } = pos;
					const posRight = pos.clone(1, 0);
					const posDown = pos.clone(0, 1);
					return (
						<Segment
							{...{ column, row }}
							color={p.program.color}
							icon={pos === headPos() ? p.program.icon : null}
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
			<Show when={p.program.usedAction} keyed>
				<image
					x={headPos().column * gridUnitSize + 22}
					y={headPos().row * gridUnitSize - 3}
					href={getTexture("nightfall:turnCheck")}
				/>
			</Show>
		</g>
	);
};
