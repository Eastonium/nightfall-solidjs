import { getTexture } from "game/game";
import { batch, For, JSX, Show } from "solid-js";
import { useDataBattle } from "../databattle";
import { Command, isProgram, Program } from "../program";
import { Position } from "./position";
import { gridUnitSize } from "./segment";
import { floodFindPositions } from "./utils";

interface TargetProps {
	program: Program;
	command: Command | null;
}
export const Targets = (p: TargetProps) => {
	const [level, setLevel] = useDataBattle();

	const targetPositions = () => {
		if (p.command) {
			return floodFindPositions(
				p.program.slug[0],
				(pos, dist) => dist <= p.command!.range
			)
				.slice(1)
				.filter(([sectorIndex]) => level.solid[sectorIndex]); // TODO: Make this use the targets prop
		} else {
			return floodFindPositions(
				p.program.slug[0],
				(pos, dist) =>
					dist <= p.program.speed &&
					level.solid[pos.sectorIndex] &&
					(!level.mapPrograms[pos.sectorIndex] ||
						level.mapPrograms[pos.sectorIndex] == p.program)
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
			if (
				level.mapPrograms[pos.sectorIndex] &&
				level.mapPrograms[pos.sectorIndex] != p.program
			) {
				props.onClick = () => console.log("Attack!");
				props.style = "cursor: pointer";
			} else {
				props.style = "opacity: 0.4";
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
			props.onClick = () => {
				batch(() => {
					setLevel(
						"programs",
						(program) => program.id === p.program.id,
						"slug",
						(slug) => [
							pos,
							...slug.filter((pos2) => !pos2.equals(pos)),
						]
					);
					setLevel("mapPrograms", pos.sectorIndex, p.program);
				});
			};
			props.style = "cursor: pointer";
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
