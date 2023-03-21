import { For, Index, JSX, Show, splitProps } from "solid-js";

import { useDataBattle } from "../index";
import { Position } from "./position";
import {
	gridUnitSize,
	Segment,
	SegmentClipPath,
	CellSelectionIndicator,
} from "./segment";
import { Chit as IChit } from "../chit";
import { Command, isProgram, Program as IProgram } from "../program";
import { getTexture } from "game/game";
import { Targets } from "./targets";

interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export const Grid = (props: GridProps) => {
	const [p, gridProps] = splitProps(props, []);
	const [level, setLevel] = useDataBattle();

	const selectedChitPosition = () => {
		const selectedChit = level.selection?.chit;
		if (!selectedChit) return null;
		return isProgram(selectedChit)
			? selectedChit.slug[0]
			: selectedChit.pos;
	};

	const programSelection = (): null | {
		program: IProgram;
		command: Command | null;
	} => {
		if (!level.selection || !isProgram(level.selection.chit)) return null;
		return {
			program: level.selection.chit,
			command: level.selection.command,
		};
	};

	return (
		<div {...gridProps}>
			<svg
				width={level.width * gridUnitSize}
				height={level.height * gridUnitSize}
			>
				<g>
					<Index each={level.solid}>
						{(isSolid, sectorIndex) =>
							isSolid() && ( // TODO: Make sure this isn't broken when I add BitMan
								<image
									x={
										(sectorIndex % level.width) *
										gridUnitSize
									}
									y={
										Math.floor(sectorIndex / level.width) *
										gridUnitSize
									}
									href={getTexture(level.style[sectorIndex])}
								/>
							)
						}
					</Index>
				</g>
				<g>
					<For each={level.chits}>
						{(chit) => <Chit chit={chit} />}
					</For>
				</g>
				<SegmentClipPath />
				<g>
					<For each={level.programs}>
						{(program) => <Program program={program} />}
					</For>
				</g>

				<Show when={selectedChitPosition()} keyed>
					{(position) => (
						<CellSelectionIndicator
							column={position.column}
							row={position.row}
						/>
					)}
				</Show>
				<g>
					<Show when={programSelection()} keyed>
						{Targets}
					</Show>
				</g>
			</svg>
		</div>
	);
};

interface ChitProps {
	chit: IChit;
}
const Chit = (p: ChitProps) => {
	const [, setLevel] = useDataBattle();
	const { column, row } = p.chit.pos;

	return (
		<image
			x={column * gridUnitSize}
			y={row * gridUnitSize}
			href={p.chit.icon}
			onClick={() =>
				setLevel("selection", { chit: p.chit, command: null })
			}
		/>
	);
};

interface ProgramProps {
	program: IProgram;
}
const Program = (p: ProgramProps) => {
	const [, setLevel] = useDataBattle();
	const sortedSlug = () => [...p.program.slug].sort(Position.compare);

	return (
		<g
			onClick={() =>
				setLevel("selection", { chit: p.program, command: null })
			}
		>
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
