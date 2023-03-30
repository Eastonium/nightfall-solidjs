import { Chit } from "game/dataBattle/chit";
import { LevelDefinition } from "game/dataBattle/level";

const awardCredits =
	(amount: number): Chit["onLandOn"] =>
	(program, { collectCredits }) => {
		if (program.team === 0) {
			collectCredits(amount);
			return true;
		}
	};

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
		⬜⬜⬜⬜⬜⬛⬛⬛⬛⬜⬜⬜⬜⬜
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
				if (program.team === 0) {
					endGame(program.team);
					return true;
				}
			},
		},
		{
			id: "nightfall:credits",
			pos: [1, 5],
			onLandOn: awardCredits(200),
		},
		{
			id: "nightfall:credits",
			pos: [1, 8],
			onLandOn: awardCredits(200),
		},
	],
	programs: [
		{ id: "nightfall:dog_2", slug: [[3, 1]], team: 1 },
		{ id: "nightfall:dog_2", slug: [[2, 2]], team: 1 },
		{ id: "nightfall:dog_2", slug: [[0, 3]], team: 1 },
		{ id: "nightfall:dog_2", slug: [[1, 4]], team: 1 },
		{ id: "nightfall:dog_2", slug: [[2, 5]], team: 1 },
		{ id: "nightfall:dog_2", slug: [[1, 7]], team: 1 },
		{ id: "nightfall:dog_2", slug: [[3, 9]], team: 1 },
	],
	uploadZones: [
		{ team: 0, pos: [11, 1] },
		{ team: 0, pos: [12, 1] },
		{ team: 0, pos: [11, 9] },
		{ team: 0, pos: [12, 9] },
	],
	teams: [{ id: 0 }, { id: 1, ai: true }],
	onTeamEliminated(team, _, { endGame }) {
		if (team === 0) endGame(1);
	},
	creditReward: 1000,
};
export default Test_Level_1;
