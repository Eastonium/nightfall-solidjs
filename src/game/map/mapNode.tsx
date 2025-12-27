import { styled } from "solid-styled-components";
import { useSaveData } from "../saveData";
import { Show } from "solid-js";

export interface MapNode {
	id: number;
	label: string;
	theme: MapNodeTheme;
	unlockDeps: MapNode[];
	onActivate(): void;
	x: number;
	y: number;
}

export enum MapNodeTheme {
	SmartHQ = "white",
	WarezZone = "rebeccapurple",
	CellularAutomata = "lightgreen",
	Pharmaus = "lightblue",
	PED = "mediumaquamarine",
	LuckyMonkey = "green",
	DrDonut = "orange",
	FinalSpooky = "black",
}

export interface MapNodeProps {
	node: MapNode;
}

export const MapNodeComponent = (props: MapNodeProps) => {
	var node = props.node;
	const [
		{ isNodeAccessible, isNodeCompleted, isNodeRevealed },
		{ completeNode, clearSaveData },
	] = useSaveData();

	return (
		<Show when={isNodeRevealed(node)}>
			<Node
				style={{
					left: `${node.x}px`,
					top: `${node.y}px`,
				}}
				disabled={!isNodeAccessible(node)}
				onClick={() => completeNode(node.id)}
				onDblClick={clearSaveData}
			>
				<NodeCircle
					color={
						isNodeCompleted(node) ? node.theme.toString() : "grey"
					}
				/>
				{node.label && <NodeLabel>{node.label}</NodeLabel>}
			</Node>
		</Show>
	);
};

const Node = styled("button")`
	position: absolute;
	transform: translate(-50%, -50%);
	pointer-events: auto;
`;

const NodeCircle = styled("div")<{ color: string }>`
	width: 24px;
	height: 24px;
	border-radius: 50%;
	border: solid 2px white;
	background: ${(p) => p.color};
	box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
	transition: all 0.2s ease;

	${() => Node.class(null!)}:enabled:hover &, ${() => Node.class(null!)}:enabled:focus & {
		width: 32px;
		height: 32px;
	}
`;

const NodeLabel = styled("div")`
	position: absolute;
	top: 100%;
	left: 50%;
	transform: translateX(-50%);
	margin-top: 4px;
	white-space: nowrap;
	background: rgba(0, 0, 0, 0.7);
	color: white;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	pointer-events: none;
	opacity: 0;

	${Node.class}:hover &, ${Node.class}:focus & {
		opacity: 1;
	}
`;
