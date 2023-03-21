import { getTexture } from "game/game";
import { For, JSX } from "solid-js";
import { Command, Program } from "../program";
import { useDataBattle } from "../store";
import { Position } from "./position";
import { gridUnitSize } from "./segment";
import { floodFindPositions } from "./utils";

interface TargetProps {
	program: Program;
	command: Command | null;
}
export const Targets = (p: TargetProps) => {
	const [databattle, { moveProgram }] = useDataBattle();

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
					dist <= p.program.speed &&
					databattle.solid[pos.sectorIndex] &&
					(!databattle.mapPrograms[pos.sectorIndex] ||
						databattle.mapPrograms[pos.sectorIndex] == p.program)
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

			const programTarget = databattle.mapPrograms[pos.sectorIndex];
			if (
				(p.command.usable?.call(p.program) ?? true) &&
				p.command.targets.find(
					(target) =>
						(target === "void" &&
							!databattle.solid[pos.sectorIndex]) ||
						(target === "solid" &&
							databattle.solid[pos.sectorIndex]) ||
						(programTarget &&
							((target === "enemy" &&
								programTarget.team !== p.program.team) ||
								(target === "ally" &&
									programTarget.team === p.program.team) ||
								(target === "self" &&
									programTarget === p.program)))
				)
			) {
				props.onClick = () =>
					p.command!.effect.call(p.program, pos, programTarget);
				props.style = "cursor: pointer";
			} else {
				props.style = "opacity: 0.4; pointer-events: none";
			}
		} else if (dist === 1) {
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
			props.style = "cursor: pointer";
		} else {
			props.style = "opacity: 0.7; pointer-events: none";
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
						x={pos.column * gridUnitSize}
						y={pos.row * gridUnitSize}
						{...targetProps(pos, dist)}
					/>
				);
			}}
		</For>
	);
};
