import { For, Index, JSX, Show, splitProps } from "solid-js";

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
import { useDataBattle } from "../store";

interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export const Grid = (gridProps: GridProps) => {
	// const [p, gridProps] = splitProps(props, []);
	const [dataBattle] = useDataBattle();

	const selectedChitPosition = () => {
		const selectedChit = dataBattle.selection?.chit;
		if (!selectedChit) return null;
		return isProgram(selectedChit)
			? selectedChit.slug[0]
			: selectedChit.pos;
	};

	const programSelection = (): null | {
		program: IProgram;
		command: Command | null;
	} => {
		if (!dataBattle.selection || !isProgram(dataBattle.selection.chit))
			return null;
		return {
			program: dataBattle.selection.chit,
			command: dataBattle.selection.command,
		};
	};

	return (
		<div {...gridProps}>
			<svg
				width={dataBattle.width * gridUnitSize}
				height={dataBattle.height * gridUnitSize}
			>
				<g>
					<Index each={dataBattle.solid}>
						{(isSolid, sectorIndex) => (
							<Show when={isSolid()} keyed>
								<image
									x={
										(sectorIndex % dataBattle.width) *
										gridUnitSize
									}
									y={
										Math.floor(
											sectorIndex / dataBattle.width
										) * gridUnitSize
									}
									href={getTexture(
										dataBattle.style[sectorIndex]
									)}
								/>
							</Show>
						)}
					</Index>
				</g>
				<g>
					<For each={dataBattle.chits}>
						{(chit) => <Chit chit={chit} />}
					</For>
				</g>
				<SegmentClipPath />
				<g>
					<For each={dataBattle.programs}>
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

interface ProgramProps {
	program: IProgram;
}
const Program = (p: ProgramProps) => {
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
