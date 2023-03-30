import { Position } from "./grid/position";
import {
	floodFindPositions,
	spreadFromPositions,
	tracePathToPosition,
} from "./grid/utils";
import { Level } from "./level";
import { Command, Program } from "./program";
import { Actions, Selectors, useDataBattle } from "./store";

export function executeAiTurn(
	{ dataBattle }: Selectors,
	{ moveProgram, runProgramCommand, switchToNextTeam }: Actions
) {
	if (dataBattle.phase.name !== "turn") return;
	const currentTeam = dataBattle.phase.team;

	const programs = dataBattle.programs.filter(
		(prog) => prog.team === currentTeam.id && prog.slug.length
	);
	// TODO: This check for the game phase feels janky. Something about the AI turn here feels like it could break
	while (programs.length && dataBattle.phase.name === "turn") {
		const program = programs.splice(
			Math.floor(Math.random() * programs.length),
			1
		)[0];
		const navPath = findAttackerPath(
			program,
			program.commands[0],
			dataBattle
		);
		if (!navPath) throw "Error finding path for AI";
		while (program.usedSpeed < Math.min(program.speed, navPath.length)) {
			moveProgram(
				program,
				program.slug[0].new(navPath[program.usedSpeed][0])
			);
		}

		const potentialTargetCells = floodFindPositions(
			program.slug[0],
			(pos, dist) => dist <= program.commands[0].range
		).filter(([sectorIndex]) => {
			const occupyingProgram = dataBattle.mapPrograms[sectorIndex];
			return occupyingProgram && occupyingProgram.team !== program.team;
		});
		if (potentialTargetCells.length) {
			const targetSectorIndex =
				potentialTargetCells[
					Math.floor(Math.random() * potentialTargetCells.length)
				][0];
			runProgramCommand(
				program,
				program.commands[0],
				program.slug[0].new(targetSectorIndex),
				dataBattle.mapPrograms[targetSectorIndex]
			);
		}
	}

	switchToNextTeam();
}

export function findAttackerPath(
	attackingProgram: Program,
	command: Command,
	level: Level
) {
	const headPos = attackingProgram.slug[0];

	// Find all navigable positions (ignore speed)
	const allNavigablePositions = floodFindPositions(
		headPos,
		(pos, dist) =>
			dist === 0 || // ensure a program can still move if head cell is no longer solid
			(level.solid[pos.sectorIndex] &&
				(!level.mapPrograms[pos.sectorIndex] ||
					level.mapPrograms[pos.sectorIndex]?.id ==
						attackingProgram.id))
	);

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
		headPos.gridWidth,
		headPos.gridHeight
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

	let navTarget: Position = headPos.new(-1); // this should never need to be used
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

export function AIAnalysis(p: ReturnType<typeof findAttackerPath>) {
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
							x={pos.x * gridUnitSize}
							y={pos.y * gridUnitSize}
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
							x={pos.x * gridUnitSize}
							y={pos.y * gridUnitSize}
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
							x={pos.x * gridUnitSize}
							y={pos.y * gridUnitSize}
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
