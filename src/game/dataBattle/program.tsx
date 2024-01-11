import { For, Show } from "solid-js";

import { getTexture } from "game/game";
import { Position } from "./grid/position";
import { gridUnitSize, Segment } from "./grid/segment";
import { TeamId } from "./level";
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
	) => PromiseLike<any> | void;
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
	team: TeamId;
}

export interface Program extends ProgramConfig {
	// id is here, but is instead a UID
	slug: Position[];
	team: TeamId;
	usedSpeed: number;
	usedAction: boolean;
}

export function isProgramInstance(
	program: Program | ProgramConfig | null | undefined
): program is Program {
	return program != null && Object.hasOwn(program, "slug");
}

export const ProgramComponent = (p: { program: Program }) => {
	const [, { setSelection }] = useDataBattle();
	const xySortedSlug = () => [...p.program.slug].sort(Position.compare);
	const headPos = () => p.program.slug[0];

	return (
		<g onClick={() => setSelection({ program: p.program })}>
			<For each={xySortedSlug()}>
				{(position) => {
					const posRight = position.clone(1, 0);
					const posDown = position.clone(0, 1);
					return (
						<Segment
							position={position}
							color={p.program.color}
							icon={
								position.equals(headPos())
									? p.program.icon
									: null
							}
							connectRight={
								posRight &&
								xySortedSlug().find(posRight.equals) != null
							}
							connectDown={
								posDown &&
								xySortedSlug().find(posDown.equals) != null
							}
						/>
					);
				}}
			</For>
			<Show when={p.program.usedAction}>
				<image
					x={headPos().x * gridUnitSize + 22}
					y={headPos().y * gridUnitSize - 3}
					href={getTexture("nightfall:turnCheck")}
				/>
			</Show>
		</g>
	);
};
