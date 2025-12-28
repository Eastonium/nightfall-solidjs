import { For, Show, useContext } from "solid-js";
import { styled } from "solid-styled-components";
import { useSaveData } from "../saveData";
import { GameActions, GameActionsContext } from "../game";

export interface MapNode {
	id: number;
	label: string;
	theme: MapNodeTheme;
	unlockDeps: MapNode[];
	onActivate(actions: GameActions): void;
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
	const gameActions = useContext(GameActionsContext)!;

	return (
		<Show when={isNodeRevealed(node)}>
			<Node
				style={{
					left: `${node.x}px`,
					top: `${node.y}px`,
				}}
				disabled={!isNodeAccessible(node)}
				onClick={() => node.onActivate(gameActions)}
				onContextMenu={() => completeNode(node.id)}
				onDblClick={clearSaveData}
			>
				<NodeCircle
					color={
						isNodeCompleted(node) ? node.theme.toString() : "grey"
					}
				/>
				{node.label && <NodeLabel>{node.label}</NodeLabel>}
			</Node>
			{/* Add a line from the dependency nodes to this one */}
			<For each={node.unlockDeps}>
				{(depNode) => (
					<Show when={isNodeRevealed(depNode)}>
						<NodeDepLine node={node} depNode={depNode} />
					</Show>
				)}
			</For>
		</Show>
	);
};

const Node = styled("button")`
	position: absolute;
	z-index: 1;
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

	${() => Node.class(null!)}:enabled:hover &, ${() =>
		Node.class(null!)}:enabled:focus & {
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

const NodeDepLine = (props: { node: MapNode; depNode: MapNode }) => {
	const { node, depNode } = props;
	const x1 = depNode.x;
	const y1 = depNode.y;
	const x2 = node.x;
	const y2 = node.y;
	const length = Math.hypot(x2 - x1, y2 - y1);
	const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

	return (
		<DepLine
			style={{
				width: `${length}px`,
				transform: `translate(${x1}px, ${y1}px) rotate(${angle}deg)`,
			}}
		/>
	);
};
const DepLine = styled("div")`
	position: absolute;
	height: 2px;
	background: white;
	pointer-events: none;
	transform-origin: 0 0;
	opacity: 0.5;
`;
