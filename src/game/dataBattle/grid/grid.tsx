import {
	Accessor,
	For,
	Index,
	JSX,
	Setter,
	Show,
	splitProps,
} from "solid-js";

import { useDataBattle } from "../index";
import { Position } from "./position";
import {
	gridUnitSize,
	Segment,
	SegmentClipPath,
	CellSelectionIndicator,
	Tile,
} from "./segment";
import { Chit as IChit } from "../chit";
import { isProgram, Program as IProgram } from "../program";

interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {
	selectedChit: Accessor<IChit | IProgram | null>;
	setSelectedChit: Setter<IChit | IProgram>;
}
export const Grid = (props: GridProps) => {
	const [p, gridProps] = splitProps(props, [
		"selectedChit",
		"setSelectedChit",
	]);
	const [level, setLevel] = useDataBattle();

	const selectedChitPosition = () => {
		const selectedChit = p.selectedChit();
		if (!selectedChit) return null;
		return isProgram(selectedChit)
			? selectedChit.slug[0]
			: selectedChit.pos;
	};

	return (
		<div {...gridProps}>
			<svg
				width={level.width * gridUnitSize}
				height={level.height * gridUnitSize}
				onDblClick={() => {
					const selectedChit = p.selectedChit();
					if (!selectedChit || !isProgram(selectedChit)) return;
					setLevel(
						"programs",
						(program) => program.id === selectedChit.id,
						"slug",
						(slug) => [slug[0].clone(1, 0), ...slug]
					);
				}}
			>
				<g>
					<Index each={level.solid}>
						{(isSolid, sectorIndex) => (
							<Show when={isSolid()} keyed>
								<Tile
									column={sectorIndex % level.width}
									row={Math.floor(sectorIndex / level.width)}
								/>
							</Show>
						)}
					</Index>
				</g>
				<g>
					<For each={level.chits}>
						{(chit) => (
							<Chit
								chit={chit}
								setSelectedChit={p.setSelectedChit}
							/>
						)}
					</For>
				</g>
				<SegmentClipPath />
				<g>
					<For each={level.programs}>
						{(program) => (
							<Program
								program={program}
								setSelectedChit={p.setSelectedChit}
							/>
						)}
					</For>
				</g>

				<Show when={p.selectedChit()} keyed>
					{(chit) => (
						<>
							<CellSelectionIndicator
								column={
									(isProgram(chit) ? chit.slug[0] : chit.pos)
										.column
								}
								row={
									(isProgram(chit) ? chit.slug[0] : chit.pos)
										.row
								}
							/>

						</>
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
			href={p.chit.icon}
			onClick={() => p.setSelectedChit(p.chit)}
		/>
	);
};

interface ProgramProps {
	program: IProgram;
	setSelectedChit: Setter<IProgram>;
}
const Program = (p: ProgramProps) => {
	const sortedSlug = () => [...p.program.slug].sort(Position.compare);
	return (
		<g onClick={() => p.setSelectedChit(p.program)}>
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
