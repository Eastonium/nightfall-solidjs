import { Show } from "solid-js";
import { ChitComponent } from "./chit";
import { Position } from "./grid/position";
import { TeamId } from "./level";
import { Program, ProgramComponent, ProgramConfig } from "./program";
import { getChitConfig } from "game/game";

export type UploadZoneInstanceDefinition = {
	team: TeamId;
	pos: [number, number];
};
export type UploadZone = {
	team: TeamId;
	pos: Position;
	program: ProgramConfig | null;
};

export const UploadZoneComponent = (p: UploadZone) => {
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
