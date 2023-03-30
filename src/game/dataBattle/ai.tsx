import { getTexture } from "game/game";
import { For } from "solid-js";
import { Position } from "./grid/position";
import { gridUnitSize } from "./grid/segment";
import { floodFindPositions } from "./grid/utils";
import { Level } from "./level";
import { Command, Program } from "./program";
import { useDataBattle } from "./store";

export function runAiAnalysis(
	attackingProgram: Program,
	command: Command,
	level: Level
) {
	const allNavigablePositions = floodFindPositions(
		attackingProgram.slug[0],
		(pos, dist) =>
			dist === 0 /*dist <= p.program.speed - p.program.usedSpeed &&*/ || // ensure a program can still move if head cell is no longer solid // Remove restriction on speed here
			(level.solid[pos.sectorIndex] &&
				(!level.mapPrograms[pos.sectorIndex] ||
					level.mapPrograms[pos.sectorIndex]?.id ==
						attackingProgram.id))
	);

	const pos = attackingProgram.slug[0].clone(); // reuseable position object
	const targetPositions: Set<number>[] = [new Set()]; // targetPositions[distFromTarget]
	let soonestTurn = Infinity;
	const soonestTurnPositions: typeof allNavigablePositions = [];

	// get the positions off all enemies
	level.programs.forEach((program) => {
		if (program.team === attackingProgram.team) return;
		program.slug.map((pos) => targetPositions[0].add(pos.sectorIndex));
	});

	// TODO: Might need to record distance and which programs are in range in a map
	for (let dist = 1; dist <= command.range; dist++) {
		targetPositions.push(new Set());
		targetPositions[dist - 1].forEach((sectorIndex) => {
			pos.sectorIndex = sectorIndex;
			pos.getSurroundingSectorIndexes().forEach((sectorIndex) => {
				if (
					targetPositions[dist - 1].has(sectorIndex) ||
					targetPositions[dist - 2]?.has(sectorIndex)
				) {
					return;
				}
				targetPositions[dist].add(sectorIndex);

				// Pre-filter which positions to try to get to based on how soon they can be gotten to
				const navigablePos = allNavigablePositions.find(
					([si]) => si === sectorIndex
				);
				if (navigablePos == null) return;
				//  0 means accessible without moving, 1 means accessible this turn, ect.
				// TODO: Currently favors not moving
				const turnsFromAttacker = Math.ceil(
					navigablePos[1] / attackingProgram.speed
				);
				if (turnsFromAttacker === soonestTurn) {
					soonestTurnPositions.push(navigablePos);
				} else if (turnsFromAttacker < soonestTurn) {
					soonestTurn = turnsFromAttacker;
					soonestTurnPositions.splice(0, Infinity, navigablePos);
				}
			});
		});
	}
	// const allAttackPositions = targetPositions
	// 	.slice(1) // Ignore current positions of targets
	// 	.reduce<number[]>((allPos, posSet) => {
	// 		allPos.push(...posSet);
	// 		return allPos;
	// 	}, []);

	const navTarget: typeof allNavigablePositions[number] =
		soonestTurnPositions.length
			? soonestTurnPositions[
					Math.floor(Math.random() * soonestTurnPositions.length)
			  ]
			: [attackingProgram.slug[0].sectorIndex, 0]; // TODO: Just try to move closer to a target

	const navPath = [navTarget];
	while (navPath[0][1] !== 0) {
		pos.sectorIndex = navPath[0][0];
		const surroundingSectorIndexes = pos.getSurroundingSectorIndexes();
		const nextClosestSectorIndexes = allNavigablePositions.filter(
			([sectorIndex, dist]) =>
				dist === navPath[0][1] - 1 &&
				surroundingSectorIndexes.includes(sectorIndex)
		);
		navPath.unshift(
			nextClosestSectorIndexes[
				Math.floor(Math.random() * nextClosestSectorIndexes.length)
			]
		);
	}

	return {
		program: attackingProgram,
		// allAttackPositions,
		allNavigablePositions,
		soonestTurn,
		soonestTurnPositions,
		navTarget,
		navPath,
	};
}

export function AIAnalysis(p: ReturnType<typeof runAiAnalysis>) {
	const [{ dataBattle }] = useDataBattle();

	return (
		<g>
			<For each={p.navPath}>
				{([sectorIndex, dist]) => {
					const pos = new Position(
						sectorIndex,
						dataBattle.width,
						dataBattle.height
					);

					return (
						<image
							x={pos.column * gridUnitSize}
							y={pos.row * gridUnitSize}
							href={getTexture(
								"nightfall:target" +
									(p.soonestTurn <= 1
										? "Green" // Can get here this turn
										: "Cyan") // Could get there on a later turn
							)}
							style={{ "pointer-events": "none" }}
						/>
					);
				}}
			</For>
			{/* <For each={p.soonestTurnPositions}>
				{([sectorIndex, dist]) => {
					const pos = new Position(
						sectorIndex,
						dataBattle.width,
						dataBattle.height
					);

					return (
						<image
							x={pos.column * gridUnitSize}
							y={pos.row * gridUnitSize}
							href={getTexture(
								"nightfall:target" +
									(p.soonestTurn <= 1
										? "Green" // Can get here this turn
										: "Cyan") // Could get there on a later turn
							)}
							style={{ "pointer-events": "none" }}
						/>
					);
				}}
			</For> */}
			{/* <For each={p.allAttackPositions}>
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
			</For> */}
		</g>
	);
}
