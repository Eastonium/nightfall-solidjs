import { Accessor, For, Index, JSX, Setter, Show, splitProps, useContext } from "solid-js";

import { useDataBattle } from "../index";
import { Position } from "./position";
import { gridUnitSize, Segment, SegmentClipPath, CellSelectionIndicator, Tile } from "./segment";
import { Chit as IChit } from "../chit";
import { Program as IProgram } from "../program";

interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {
	selectedChit: Accessor<IChit | IProgram | null>;
	setSelectedChit: Setter<IChit | IProgram>;
}
export const Grid = (props: GridProps) => {
	const [p, gridProps] = splitProps(props, ["selectedChit", "setSelectedChit"]);
	const { width, height, solid, chits, programs } = useDataBattle();

	const selectedChitPosition = () => {
		const selectedChit = p.selectedChit();
		if (!selectedChit) return null;
		return selectedChit instanceof IProgram ? selectedChit.slug[0] : selectedChit.pos;
	};

	return (
		<div {...gridProps}>
			<svg width={width * gridUnitSize} height={height * gridUnitSize}>
				<Index each={solid}>
					{(isSolid, sectorIndex) =>
						isSolid() && (
							<Tile column={sectorIndex % width} row={Math.floor(sectorIndex / width)} />
						)
					}
				</Index>
				<For each={chits}>
					{chit => <Chit chit={chit} setSelectedChit={p.setSelectedChit} />}
				</For>
				<SegmentClipPath />
				<For each={programs}>
					{program => <Program program={program} setSelectedChit={p.setSelectedChit} />}
				</For>

				<Show when={selectedChitPosition()}>
					{selectedChitPosition => (
						<CellSelectionIndicator
							// The key makes it create a new element each time the selected sector changes
							// This way the the animation resets
							// key={selectedChitPosition.sectorIndex}
							column={selectedChitPosition.column}
							row={selectedChitPosition.row}
						/>
					)}
				</Show>
			</svg>
		</div>
	);
};

interface ChitProps {
	chit: IChit;
	setSelectedChit: Setter<IChit>;
}
const Chit = (p: ChitProps) => {
	const { column, row } = p.chit.pos;

	return (
		<image
			x={column * gridUnitSize}
			y={row * gridUnitSize}
			attr:href={p.chit.icon}
			onClick={() => p.setSelectedChit(p.chit)}
		/>
	);
};

interface ProgramProps {
	program: IProgram;
	setSelectedChit: Setter<IProgram>;
}
const Program = (p: ProgramProps) => {
	const sortedSlug = () => p.program.slug.sort(Position.compare);
	return (
		<g onClick={() => p.setSelectedChit(p.program)}>
			<For each={sortedSlug()}>
				{(pos, i) => {
					const { column, row } = pos;
					const posRight = pos.clone().right();
					const posDown = pos.clone().down();
					return (
						<Segment
							{...{ column, row }}
							color={p.program.color}
							icon={i() === 0 ? p.program.icon : null}
							connectRight={posRight && sortedSlug().find(posRight.equals) != null}
							connectDown={posDown && sortedSlug().find(posDown.equals) != null}
						/>
					);
				}}
			</For>
		</g>
	);
};
