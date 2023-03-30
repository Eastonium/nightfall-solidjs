import { For, Index, JSX, Show } from "solid-js";

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
import { AIAnalysis } from "../ai";

interface GridProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export const Grid = (gridProps: GridProps) => {
	// const [p, gridProps] = splitProps(props, []);
	const [{ dataBattle, selectionPosition, aiAnalysis }] = useDataBattle();

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
						</Show>
					)}
				</Index>

				<For each={dataBattle.chits}>
					{(chit) => <ChitComponent chit={chit} />}
				</For>

				<SegmentClipPath />

				<For
					each={dataBattle.programs.filter(
						(prog) => prog.slug.length > 0
					)}
				>
					{(program) => <ProgramComponent program={program} />}
				</For>

				<For each={dataBattle.uploadZones}>
					{(uploadZone) => <UploadZoneComponent {...uploadZone} />}
				</For>

				<Show when={selectionPosition()} keyed>
					{(position) => (
						<CellSelectionIndicator x={position.x} y={position.y} />
					)}
				</Show>

				<Show when={aiAnalysis()} keyed>
					{AIAnalysis}
				</Show>
				<Show
					when={
						!aiAnalysis() &&
						dataBattle.selection &&
						!dataBattle.selection.chit &&
						isProgramInstance(dataBattle.selection.program) && {
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
				{(program) => (
					<g opacity={0.65}>
						<ProgramComponent program={program} />;
					</g>
				)}
			</Show>
		</g>
	);
};
