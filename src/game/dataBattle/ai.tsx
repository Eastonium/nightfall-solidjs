import { wait } from "utils";
import { Position } from "./grid/position";
import {
	floodFindPositions,
	spreadFromPositions,
	tracePathToPosition,
} from "./grid/utils";
import { Level } from "./level";
import { Command, Program } from "./program";
import { Actions, Selectors, useDataBattle } from "./store";

export async function executeAiTurn(
	{ dataBattle }: Selectors,
	{ setSelection, moveProgram, runProgramCommand, endProgramTurn, switchToNextTeam }: Actions
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
		const command = program.commands[0];

		const navPath = findAttackerPath(program, command, dataBattle);
		if (!navPath) throw "Error finding path for AI";
		while (program.usedSpeed < Math.min(program.speed, navPath.length)) {
			moveProgram(
				program,
				program.slug[0].new(navPath[program.usedSpeed][0])
			);
			await wait(200);
		}
		if (program.usedSpeed < program.speed) {
			// select command since it usually only does if all speed is used
			setSelection({ program, command });
			await wait(200);
		}
		await wait(200);
		
		const potentialTargetCells = floodFindPositions(
			program.slug[0],
			(pos, dist) => dist <= command.range
		).filter(([sectorIndex]) => {
			const occupyingProgram = dataBattle.mapPrograms[sectorIndex];
			return occupyingProgram && occupyingProgram.team !== program.team;
		});
		if (potentialTargetCells.length) {
			const targetSectorIndex =
				potentialTargetCells[
					Math.floor(Math.random() * potentialTargetCells.length)
				][0];
			await runProgramCommand(
				program,
				command,
				program.slug[0].new(targetSectorIndex),
				dataBattle.mapPrograms[targetSectorIndex]
			);
		}
		
		setSelection(null);
		// Manually mark the program's turn as complete since it won't automatically if the program didn't move or use a command
		endProgramTurn(program.id);
	}
	await wait(200);

	switchToNextTeam();
}

export function findAttackerPath(
	attackingProgram: Program,
	command: Command,
	level: Level
) {
	const headPos = attackingProgram.slug[0];

	// Find all navigable positions (ignoring speed)
	const allNavigablePositions = floodFindPositions(
		headPos,
		(pos, dist) =>
			dist === 0 || // ensure a program can still move if head cell is no longer solid
			(level.solid[pos.sectorIndex] &&
				(!level.mapPrograms[pos.sectorIndex] ||
					level.mapPrograms[pos.sectorIndex]?.id ==
						attackingProgram.id))
	);
	// get the positions off all enemies
	const targetPositions: Set<number> = new Set();
	level.programs.forEach((program) => {
		if (program.team === attackingProgram.team) return;
		program.slug.forEach((pos) => targetPositions.add(pos.sectorIndex));
	});

	// Calculate the positions closest to the enemies that can happen the soonest
	let soonestTurn = Infinity; // Ideally will be 1 (can move there and attack this turn)
	const soonestTurnPositions: typeof allNavigablePositions = [];
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
				// TODO: find() is slow, try to find a better way? Map?
				([si]) => si === sectorIndex
			);
			if (navigablePos == null) continue;
			// 0 means accessible without moving, 1 means accessible this turn, 2 means accessible next turn, ect.
			const turnsFromAttacker = Math.max(
				1,
				Math.ceil(navigablePos[1] / attackingProgram.speed)
			);
			if (turnsFromAttacker === soonestTurn) {
				soonestTurnPositions.push(navigablePos);
			} else if (turnsFromAttacker < soonestTurn) {
				// Positions accessible on a sooner turn found
				soonestTurn = turnsFromAttacker;
				soonestTurnPositions.splice(0, Infinity, navigablePos);
			}
		}
	}

	let navTarget: Position = headPos.new(-1); // this should never need to be used
	if (soonestTurnPositions.length) {
		// Choose a random position to go to of the options
		navTarget.sectorIndex =
			soonestTurnPositions[
				Math.floor(Math.random() * soonestTurnPositions.length)
			][0];
	} else {
		// Way is blocked, just try to get as close as possible
		// Start by iterating over all the next closest positions to the enemies
		for (let positions of spreadGenerator) {
			const closestNavigablePositions: typeof allNavigablePositions = [];
			// See if these closer positions are somewhere we can navigate to
			for (let sectorIndex of positions) {
				const navigablePos = allNavigablePositions.find(
					([si]) => si === sectorIndex
				);
				if (navigablePos == null) continue;
				// Add the position if the list is empty or if the distance is equal to other found positions
				if (
					!closestNavigablePositions.length ||
					navigablePos[1] === closestNavigablePositions[0][1]
				) {
					closestNavigablePositions.push(navigablePos);
				} else if (navigablePos[1] < closestNavigablePositions[0][1]) {
					closestNavigablePositions.splice(0, Infinity, navigablePos);
				}
			}
			// If any navigable positions were found at this distance, set the navTarget
			if (closestNavigablePositions.length) {
				navTarget.sectorIndex =
					closestNavigablePositions[ // Choose a random one of the options
						Math.floor(
							Math.random() * closestNavigablePositions.length
						)
					][0];
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
