import { For, Index, JSX, Show } from "solid-js";

import { gridUnitSize, SegmentWrapper } from "./segment";
import { ChitComponent } from "../chit";
import { isProgramInstance, ProgramComponent } from "../program";
import { getTexture } from "game/game";
import { Targets } from "./targets";
import { useDataBattle } from "../store";
import { GridCursor } from "./cursor";
import { UploadZoneComponent } from "../uploadZone";

interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export const Grid = (gridProps: GridProps) => {
	// const [p, gridProps] = splitProps(props, [""]);
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

				<SegmentWrapper
					flashPositions={
						!!dataBattle.selection &&
						dataBattle.selection.program &&
						isProgramInstance(dataBattle.selection.program) &&
						!dataBattle.selection.command &&
						dataBattle.selection.program.maxSize > 1 &&
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
				</SegmentWrapper>

				<For each={dataBattle.uploadZones}>
					{(uploadZone) => <UploadZoneComponent {...uploadZone} />}
				</For>

				<GridCursor />

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
