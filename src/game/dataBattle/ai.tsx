import { getTexture } from "game/game";
import { For } from "solid-js";
import { Position } from "./grid/position";
import { gridUnitSize } from "./grid/segment";
import {
	floodFindPositions,
	spreadFromPositions,
	tracePathToPosition,
} from "./grid/utils";
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

	const utilPos = attackingProgram.slug[0].clone(); // reuseable position object
	let soonestTurn = Infinity;
	const soonestTurnPositions: typeof allNavigablePositions = [];

	// get the positions off all enemies
	const targetPositions: Set<number> = new Set();
	level.programs.forEach((program) => {
		if (program.team === attackingProgram.team) return;
		program.slug.map((pos) => targetPositions.add(pos.sectorIndex));
	});

	const spreadGenerator = spreadFromPositions(
		targetPositions,
		utilPos.gridWidth,
		utilPos.gridHeight
	);
	for (let dist = 0; dist < command.range; dist++) {
		const positions = spreadGenerator.next();
		if (positions.done) break;
		for (let sectorIndex of positions.value) {
			// Pre-filter which positions to try to get to based on how soon they can be gotten to
			const navigablePos = allNavigablePositions.find(
				([si]) => si === sectorIndex
			);
			if (navigablePos == null) continue;
			// 0 means accessible without moving, 1 means accessible this turn, ect.
			const turnsFromAttacker = Math.max(
				1,
				Math.ceil(navigablePos[1] / attackingProgram.speed)
			);
			if (turnsFromAttacker === soonestTurn) {
				soonestTurnPositions.push(navigablePos);
			} else if (turnsFromAttacker < soonestTurn) {
				soonestTurn = turnsFromAttacker;
				soonestTurnPositions.splice(0, Infinity, navigablePos);
			}
		}
	}

	let navTarget: Position = utilPos.new(-1); // this should never need to be used
	if (soonestTurnPositions.length) {
		navTarget.sectorIndex =
			soonestTurnPositions[
				Math.floor(Math.random() * soonestTurnPositions.length)
			][0];
	} else {
		for (let positions of spreadGenerator) {
			const closestNavigablePositions: number[] = [];
			for (let sectorIndex of positions) {
				const navigablePos = allNavigablePositions.find(
					([si]) => si === sectorIndex
				);
				if (navigablePos == null) continue;
				closestNavigablePositions.push(sectorIndex);
			}
			if (closestNavigablePositions.length) {
				navTarget.sectorIndex =
					closestNavigablePositions[
						Math.floor(
							Math.random() * closestNavigablePositions.length
						)
					];
				break;
			}
		}
	}

	if (!navTarget.isValid())
		console.error("Failed to find AI navigation target");

	return tracePathToPosition(navTarget, allNavigablePositions);

	// return {
	// 	program: attackingProgram,
	// 	allNavigablePositions,
	// 	soonestTurn,
	// 	soonestTurnPositions,
	// 	navTarget,
	// 	navPath: tracePathToPosition(navTarget, allNavigablePositions),
	// };
}

export function AIAnalysis(p: ReturnType<typeof runAiAnalysis>) {
	const [{ dataBattle }] = useDataBattle();

	return (
		<g>
			{/* <For each={p.navPath}>
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
