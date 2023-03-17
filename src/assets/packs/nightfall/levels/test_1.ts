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
		{ id: "nightfall:data_item", pos: [1, 2] },
		{ id: "nightfall:credits", pos: [1, 5] },
		{ id: "nightfall:credits", pos: [1, 8] },
		{ id: "nightfall:upload_zone", pos: [11, 1] },
		{ id: "nightfall:upload_zone", pos: [12, 1] },
		{ id: "nightfall:upload_zone", pos: [11, 9] },
		{ id: "nightfall:upload_zone", pos: [12, 9] },
	],
	programs: [
		{
			id: "nightfall:dog_2",
			slug: [
				[3, 1],
				[3, 2],
				[3, 3],
				[3, 4],
			],
		},
		{ id: "nightfall:dog_3", slug: [[2, 2]] },
		{ id: "nightfall:dog_2", slug: [[0, 3]] },
		{ id: "nightfall:dog_2", slug: [[1, 4]] },
		{ id: "nightfall:dog_2", slug: [[2, 5]] },
		{ id: "nightfall:dog_2", slug: [[1, 7]] },
	],
};
export default Test_Level_1;
