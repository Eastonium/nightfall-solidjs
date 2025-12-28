import { MapNode, MapNodeTheme } from "../../../game/map/mapNode";
import Test_Level_1 from "./levels/test_1";

var nodeAlpha: MapNode = {
	id: 0,
	label: "Node Alpha",
	theme: MapNodeTheme.SmartHQ,
	unlockDeps: [],
	onActivate: () => console.log("Welcome to SMART"),
	x: 200,
	y: 150,
};
var nodeBeta: MapNode = {
	id: 1,
	label: "Node Beta",
	theme: MapNodeTheme.WarezZone,
	unlockDeps: [nodeAlpha],
	onActivate: ({ loadLevel }) => loadLevel(Test_Level_1),
	x: 500,
	y: 300,
};
var nodeCharlie: MapNode = {
	id: 2,
	label: "Node Charlie",
	theme: MapNodeTheme.Pharmaus,
	unlockDeps: [nodeAlpha],
	onActivate: () => {},
	x: 300,
	y: 450,
};
var nodeDelta: MapNode = {
	id: 3,
	label: "Node Delta",
	theme: MapNodeTheme.LuckyMonkey,
	unlockDeps: [nodeBeta, nodeCharlie],
	onActivate: () => {},
	x: 700,
	y: 200,
};
var nodeEaston: MapNode = {
	id: 4,
	label: "Node Easton",
	theme: MapNodeTheme.DrDonut,
	unlockDeps: [nodeDelta],
	onActivate: () => {},
	x: 600,
	y: 500,
};

export const mapNodes: MapNode[] = [nodeAlpha, nodeBeta, nodeCharlie, nodeDelta, nodeEaston];
