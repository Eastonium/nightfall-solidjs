import { getTexture } from "game/game";
import { batch, For, Show } from "solid-js";
import { useDataBattle } from "../databattle";
import { Command, isProgram, Program } from "../program";
import { gridUnitSize } from "./segment";
import { floodFindPositions } from "./utils";

export const Targets = () => {
	const [level, setLevel] = useDataBattle();

	const programSelection = (): null | {
		program: Program;
		command: Command | null;
	} => {
		if (!level.selection || !isProgram(level.selection.chit)) return null;
		return {
			program: level.selection.chit,
			command: level.selection.command,
		};
	};

	return (
		<Show when={programSelection()} keyed>
			{({ program, command }) => (
				<For
					each={floodFindPositions(
						program.slug[0],
						(pos, dist) =>
							dist <= (command?.range ?? program.speed) &&
							level.solid[pos.sectorIndex] &&
							(!level.mapPrograms[pos.sectorIndex] ||
								level.mapPrograms[pos.sectorIndex] == program)
					).slice(1)} // remove starting cell
				>
					{([sectorIndex, dist]) => {
						const pos = program.slug[0].new(sectorIndex);
						return (
							<image
								x={pos.column * gridUnitSize}
								y={pos.row * gridUnitSize}
								href={getTexture(
									sectorIndex ==
										program.slug[0].sectorIndex + 1
										? "nightfall:moveEast"
										: sectorIndex ==
										  program.slug[0].sectorIndex - 1
										? "nightfall:moveWest"
										: sectorIndex ==
										  program.slug[0].sectorIndex -
												program.slug[0].gridWidth
										? "nightfall:moveNorth"
										: sectorIndex ==
										  program.slug[0].sectorIndex +
												program.slug[0].gridWidth
										? "nightfall:moveSouth"
										: "nightfall:moveSpace"
								)}
								onClick={
									dist === 1
										? () => {
												batch(() => {
													setLevel(
														"programs",
														(p) =>
															p.id === program.id,
														"slug",
														(slug) => [
															pos,
															...slug.filter(
																(pos2) =>
																	!pos2.equals(
																		pos
																	)
															),
														]
													);
													setLevel(
														"mapPrograms",
														pos.sectorIndex,
														program
													);
												});
										  }
										: undefined
								}
							/>
						);
					}}
				</For>
			)}
		</Show>
	);
};
