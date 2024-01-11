import { For, Index, JSX, Show, splitProps } from "solid-js";
import { css, keyframes, styled } from "solid-styled-components";

import {
	gridUnitSize,
	SegmentClipPath,
	CellSelectionIndicator,
} from "./segment";
import { ChitComponent } from "../chit";
import { isProgramInstance, Program, ProgramComponent } from "../program";
import { getChitConfig, getTexture } from "game/game";
import { Targets } from "./targets";
import { useDataBattle } from "../store";
import { UploadZone } from "../level";
import { Position } from "./position";

interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {
	cellSelectionIndicatorRef?: (el: SVGGraphicsElement) => void;
}
export const Grid = (props: GridProps) => {
	const [p, gridProps] = splitProps(props, ["cellSelectionIndicatorRef"]);
	const [{ dataBattle }] = useDataBattle();

	return (
		<div {...gridProps}>
			<svg
				width={dataBattle.width * gridUnitSize}
				height={dataBattle.height * gridUnitSize}
			>
				<Index each={dataBattle.solid}>
					{(isSolid, sectorIndex) => (
						<Show when={isSolid()} keyed>
							<image
								x={
									(sectorIndex % dataBattle.width) *
									gridUnitSize
								}
								y={
									Math.floor(sectorIndex / dataBattle.width) *
									gridUnitSize
								}
								href={getTexture(dataBattle.style[sectorIndex])}
							/>
							{/* prettier-ignore */}
							{/* <text x={(sectorIndex % dataBattle.width) * gridUnitSize + gridUnitSize * 0.5} y={Math.floor(sectorIndex / dataBattle.width) * gridUnitSize + gridUnitSize * 0.5}>{sectorIndex}</text> */}
						</Show>
					)}
				</Index>

				<For each={dataBattle.chits}>
					{(chit) => <ChitComponent chit={chit} />}
				</For>

				<SegmentClipPath />

				<SegmentFlasher
					positions={
						!!dataBattle.selection &&
						dataBattle.selection.program &&
						isProgramInstance(dataBattle.selection.program) &&
						!dataBattle.selection.command &&
						// Doing some fancy checking just in case a program has "over health" or something
						dataBattle.selection.program.slug.length >=
							dataBattle.selection.program.maxSize &&
						dataBattle.selection.program.slug.slice(
							dataBattle.selection.program.maxSize - 1
						)
					}
				>
				<For
					each={dataBattle.programs.filter(
						(prog) => prog.slug.length > 0
					)}
				>
					{(program) => <ProgramComponent program={program} />}
				</For>
				</SegmentFlasher>

				<For each={dataBattle.uploadZones}>
					{(uploadZone) => <UploadZoneComponent {...uploadZone} />}
				</For>

				<CellSelectionIndicator ref={p.cellSelectionIndicatorRef} />

				<Show
					when={
						dataBattle.selection &&
						!dataBattle.selection.chit &&
						isProgramInstance(dataBattle.selection.program) &&
						!!dataBattle.selection.program.slug.length && {
							program: dataBattle.selection.program,
							command: dataBattle.selection.command,
						}
					}
					keyed
				>
					{Targets}
				</Show>
			</svg>
		</div>
	);
};

const SegmentFlasher = styled.g<{ positions?: Position[] | false }>((p) =>
	p.positions
		? `
	${p.positions.map((pos) => `& [data-pos="${pos.sectorIndex}"]`).join(", ")} {
		animation: 100ms infinite steps(1) ${keyframes({ "50%": { opacity: 0 } })};
	}
`
		: ""
);

const UploadZoneComponent = (p: UploadZone) => {
	const program = (): Program | null =>
		p.program
			? {
					team: p.team,
					slug: [p.pos],
					usedSpeed: 0,
					usedAction: false,
					...p.program!,
			  }
			: null;

	return (
		<g>
			<ChitComponent
				chit={{
					pos: p.pos,
					...getChitConfig("nightfall:upload_zone")!,
				}}
			/>
			<Show when={program()} keyed>
				{(program) => <ProgramComponent program={program} />}
			</Show>
		</g>
	);
};
