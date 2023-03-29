import { getTexture } from "game/game";
import { For } from "solid-js";
import { Position } from "./grid/position";
import { gridUnitSize } from "./grid/segment";
import { floodFindPositions } from "./grid/utils";
import { Level } from "./level";
import { Command, Program } from "./program";
import { useDataBattle } from "./store";

const offsets: [number, number][] = [
	[0, -1],
	[-1, 0],
	[1, 0],
	[0, 1],
];

export function runAiAnalysis(
	sourceProgram: Program,
	command: Command,
	level: Level
) {
	const pos = sourceProgram.slug[0].clone(); // reuseable position object
	const targetPositions: Set<number>[] = [new Set()]; // targetPositions[distFromTarget]

	// get the positions off all enemies
	level.programs.forEach((program) => {
		if (program.team === sourceProgram.team) return;
		program.slug.map((pos) => targetPositions[0].add(pos.sectorIndex));
	});

	// TODO: Might need to record distance and which programs are in range in a hash map
	for (let dist = 1; dist <= command.range; dist++) {
		targetPositions.push(new Set());
		targetPositions[dist - 1].forEach((sectorIndex, _, thisDist) => {
			offsets.forEach((offset) => {
				pos.sectorIndex = sectorIndex;
				pos.offset(...offset);
				if (
					!pos.isValid() ||
					targetPositions[dist - 1].has(pos.sectorIndex) ||
					targetPositions[dist - 2]?.has(pos.sectorIndex)
				)
					return;
				targetPositions[dist].add(pos.sectorIndex);
			});
		});
	}
	const attackPositions = targetPositions
		.slice(1)
		.reduce<number[]>((allPos, posSet) => {
			allPos.push(...posSet);
			return allPos;
		}, [])
		.filter(
			(sectorIndex) =>
				level.solid[sectorIndex] &&
				(!level.mapPrograms[sectorIndex] ||
					level.mapPrograms[sectorIndex]?.id === sourceProgram.id)
		);

	const allNavigablePositions = floodFindPositions(
		sourceProgram.slug[0],
		(pos, dist) =>
			dist === 0 /*dist <= p.program.speed - p.program.usedSpeed &&*/ || // ensure a program can still move if head cell is no longer solid // Remove restriction on speed here
			(level.solid[pos.sectorIndex] &&
				(!level.mapPrograms[pos.sectorIndex] ||
					level.mapPrograms[pos.sectorIndex]?.id == sourceProgram.id))
	);

	return { program: sourceProgram, attackPositions, allNavigablePositions };
}

export function AIAnalysis(p: ReturnType<typeof runAiAnalysis>) {
	const [{ dataBattle }] = useDataBattle();

	return (
		<For each={p.attackPositions}>
			{(sectorIndex) => {
				const pos = new Position(
					sectorIndex,
					dataBattle.width,
					dataBattle.height
				);

				const navDistance = p.allNavigablePositions.find(
					([sI]) => sI === sectorIndex
				)?.[1];

				return (
					<image
						x={pos.column * gridUnitSize}
						y={pos.row * gridUnitSize}
						href={getTexture(
							"nightfall:target" +
								(navDistance == null
									? "Red" // Can't get here
									: navDistance <= p.program.speed
									? "Green" // Can get here this turn
									: "Cyan") // Could get there on a later turn
						)}
						style={{ "pointer-events": "none" }}
					/>
				);
			}}
		</For>
	);
}
