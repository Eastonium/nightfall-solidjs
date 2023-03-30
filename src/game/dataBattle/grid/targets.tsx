import { getTexture } from "game/game";
import { For, JSX } from "solid-js";
import { Command, Program } from "../program";
import { useDataBattle } from "../store";
import { Position } from "./position";
import { gridUnitSize } from "./segment";
import { floodFindPositions } from "./utils";

interface TargetProps {
	program: Program;
	command?: Command;
}
export const Targets = (p: TargetProps) => {
	const [{ dataBattle }, actions] = useDataBattle();
	const { moveProgram, runProgramCommand } = actions;

	const targetPositions = () => {
		if (p.command) {
			return floodFindPositions(
				p.program.slug[0],
				(pos, dist) => dist <= p.command!.range
			).slice(1);
		} else {
			return floodFindPositions(
				p.program.slug[0],
				(pos, dist) =>
					dist === 0 || // ensure a program can still move if head cell is no longer solid
					(dist <= p.program.speed - p.program.usedSpeed &&
						dataBattle.solid[pos.sectorIndex] &&
						(!dataBattle.mapPrograms[pos.sectorIndex] ||
							dataBattle.mapPrograms[pos.sectorIndex]?.id ==
								p.program.id))
			).slice(1); // remove starting cell
		}
	};

	const targetProps = (pos: Position, dist: number) => {
		const props: JSX.ImageSVGAttributes<SVGImageElement> = {
			href: "nightfall:moveSpace",
		};
		if (p.command) {
			props.href =
				p.command.effectType === "harm"
					? "nightfall:targetRed"
					: p.command.effectType === "heal"
					? "nightfall:targetGreen"
					: "nightfall:targetCyan";

			const programTarget = dataBattle.mapPrograms[pos.sectorIndex];
			if (
				dataBattle.phase.name === "turn" &&
				dataBattle.phase.team === p.program.team &&
				!p.program.usedAction &&
				(p.command.usable?.call(p.program) ?? true) &&
				p.command.targets.find(
					(target) =>
						(target === "void" &&
							!dataBattle.solid[pos.sectorIndex]) ||
						(target === "solid" &&
							dataBattle.solid[pos.sectorIndex]) ||
						(programTarget &&
							((target === "enemy" &&
								programTarget.team !== p.program.team) ||
								(target === "ally" &&
									programTarget !== p.program && // prevent ally from meaning self
									programTarget.team === p.program.team) ||
								(target === "self" &&
									programTarget === p.program)))
				)
			) {
				props.onClick = () =>
					runProgramCommand(
						p.program,
						p.command!,
						pos,
						programTarget
					);
				props.style = { cursor: "pointer" };
			} else {
				props.style = { opacity: 0.4, "pointer-events": "none" };
			}
		} else if (
			dataBattle.phase.name === "turn" &&
			dataBattle.phase.team === p.program.team &&
			dist === 1
		) {
			props.href =
				pos.sectorIndex == p.program.slug[0].sectorIndex + 1
					? "nightfall:moveEast"
					: pos.sectorIndex == p.program.slug[0].sectorIndex - 1
					? "nightfall:moveWest"
					: pos.sectorIndex ==
					  p.program.slug[0].sectorIndex -
							p.program.slug[0].gridWidth
					? "nightfall:moveNorth"
					: "nightfall:moveSouth";
			props.onClick = () => moveProgram(p.program, pos);
			props.style = { cursor: "pointer" };
		} else {
			props.style = { opacity: 0.75, "pointer-events": "none" };
		}
		props.href = getTexture(props.href!);
		return props;
	};

	return (
		<For each={targetPositions()}>
			{([sectorIndex, dist]) => {
				const pos = p.program.slug[0].new(sectorIndex);
				return (
					<image
						x={pos.x * gridUnitSize}
						y={pos.y * gridUnitSize}
						{...targetProps(pos, dist)}
					/>
				);
			}}
		</For>
	);
};
