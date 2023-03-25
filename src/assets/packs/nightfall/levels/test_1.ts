import { LevelDefinition } from "game/dataBattle/level";

const Test_Level_1: LevelDefinition = {
	orientation: "orthogonal",
	width: 14,
	height: 11,
	solid: `
		⬛⬜⬜⬜⬛⬛⬛⬛⬛⬛⬜⬜⬜⬛
		⬜⬜⬜⬜⬜⬛⬛⬛⬛⬜⬜⬜⬜⬜
		⬜⬜⬜⬜⬜⬛⬛⬛⬛⬜⬜⬜⬜⬜
		⬜⬜⬜⬜⬜⬛⬛⬛⬛⬛⬜⬜⬜⬜
		⬜⬜⬜⬜⬜⬛⬛⬜⬜⬜⬜⬜⬜⬜
		⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜
		⬜⬜⬜⬜⬜⬜⬜⬛⬛⬜⬜⬜⬜⬜
		⬜⬜⬜⬜⬛⬛⬛⬛⬛⬜⬜⬜⬜⬜
		⬜⬜⬜⬜⬜⬛⬛⬛⬛⬜⬜⬜⬜⬜
		⬜⬜⬜⬜⬜⬛⬛⬛⬛⬜⬜⬜⬜⬜
		⬛⬜⬜⬜⬛⬛⬛⬛⬛⬛⬜⬜⬜⬛
	`,
	style: `
		🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧
		🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧
		🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧
		🟧🟧🟧🟧🟧🟧🟧🔲🔲🔲🔲🔲🔲🔲
		🔲🔲🔲🔲🔲🔲🔲🟧🟧🟧🟧🟧🟧🔲
		🔲🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🔲
		🔲🟧🟧🟧🟧🟧🟧🔲🔲🔲🔲🔲🔲🔲
		🔲🔲🔲🔲🔲🔲🔲🟧🟧🟧🟧🟧🟧🟧
		🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧
		🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧
		🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧🟧
	`,
	styleKey: {
		"🟧": "nightfall:tile0",
		"🔲": "nightfall:tile1",
	},
	chits: [
		{
			id: "nightfall:data_item",
			pos: [1, 2],
			onLandOn(program, { endGame }) {
				endGame(program.team);
			},
		},
		{
			id: "nightfall:credits",
			pos: [1, 5],
			onLandOn(_, { collectCredits }) {
				collectCredits(200);
			},
		},
		{
			id: "nightfall:credits",
			pos: [1, 8],
			onLandOn(_, { collectCredits }) {
				collectCredits(200);
			},
		},
	],
	programs: [
		{ id: "nightfall:data_doctor_1", slug: [[3, 1]], team: 1 },
		{ id: "nightfall:dog_3", slug: [[2, 2]], team: 1 },
		{ id: "nightfall:slingshot", slug: [[0, 3]], team: 0 },
		{ id: "nightfall:dog_2", slug: [[1, 4]], team: 1 },
		{ id: "nightfall:bit_man", slug: [[2, 5]], team: 0 },
		{ id: "nightfall:fiddle", slug: [[1, 7]], team: 1 },
	],
	uploadZones: [
		{ team: 0, pos: [11, 1] },
		{ team: 0, pos: [12, 1] },
		{ team: 0, pos: [11, 9] },
		{ team: 0, pos: [12, 9] },
	],
	teams: [0, 1],
};
export default Test_Level_1;
