import { WindowsContainer } from "ui/atoms/window";
import { Map } from "./map";
import { DataBattle } from "./dataBattle";
import { ChitConfig } from "./dataBattle/chit";
import { ProgramConfig } from "./dataBattle/program";
import { LevelDefinition, processLevel } from "./dataBattle/level";

import nightfallPackConfig from "assets/packs/nightfall";
import { GlobalStyles } from "ui/globalStyles";

export type PackConfig = {
	id: string;
	chits: ChitConfig[];
	programs: ProgramConfig[];
	levels: LevelDefinition[];
	textures: { [textureId: string]: string };
};

const gameConfig: { [key: string]: PackConfig } = { ...nightfallPackConfig };
// export const registerPack = (packId: string, packConfig: PackConfig) => {
// 	gameConfig[packId] = packConfig;
// };
export const getChitConfig = (id: string) => {
	const [packId, chitId] = id.split(":");
	return gameConfig[packId]?.chits?.find((chit) => chit.id === chitId);
};
export const getProgramConfig = (id: string) => {
	const [packId, programId] = id.split(":");
	return gameConfig[packId]?.programs?.find(
		(program) => program.id === programId
	);
};
export const getTexture = (id: string) => {
	const [packId, textureId] = id.split(":");
	return gameConfig[packId]?.textures?.[textureId];
};

export const Game = () => {
	// Some sort of thing here to track which levels are open

	return (
		<>
			<GlobalStyles />
			<Map />
			<WindowsContainer coverScreen>
				{/* <DataBattle
					level={processLevel(
						nightfallPackConfig.nightfall.levels[0]
					)}
					x={2}
					y={2}
				/> */}
			</WindowsContainer>
		</>
	);
};
