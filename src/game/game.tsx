import { createContext, createSignal, For } from "solid-js";
import { WindowsContainer } from "../ui/atoms/window";
import { Map } from "./map";
import { DataBattle } from "./dataBattle";
import { ChitConfig } from "./dataBattle/chit";
import { ProgramConfig } from "./dataBattle/program";
import { Level, LevelDefinition, processLevel } from "./dataBattle/level";
import nightfallPackConfig from "../assets/packs/nightfall";
import { GlobalStyles } from "../ui/globalStyles";
import { createSaveDataStore, SaveDataContext } from "./saveData";
import { MapNode } from "./map/mapNode";

export type PackConfig = {
	id: string;
	chits: ChitConfig[];
	programs: ProgramConfig[];
	levels: LevelDefinition[];
	mapNodes: MapNode[];
	textures: { [textureId: string]: string };
};

export type GameActions = {
	loadLevel: (level: LevelDefinition) => void;
	abortDataBattle: (level: Level) => void;
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

export const GameActionsContext = createContext<GameActions>();

export const Game = () => {
	// Some sort of thing here to track which levels are open
	const saveDataStore = createSaveDataStore();

	const [dataBattles, setDataBattles] = createSignal<Level[]>([]);

	var gameActions: GameActions = {
		loadLevel: (levelDef: LevelDefinition) => {
			const level = processLevel(levelDef);
			setDataBattles((levels) => [...levels, level]);
		},
		abortDataBattle: (level: Level) => {
			setDataBattles((levels) => levels.filter((l) => l !== level));
		},
	};

	return (
		<GameActionsContext.Provider value={gameActions}>
			<SaveDataContext.Provider value={saveDataStore}>
				<GlobalStyles />
				<Map nodes={nightfallPackConfig.nightfall.mapNodes} />
				<WindowsContainer coverScreen>
					<For each={dataBattles()}>
						{(level, i) => (
							<DataBattle
								level={level}
								x={i() * 20}
								y={i() * 20}
							/>
						)}
					</For>
				</WindowsContainer>
			</SaveDataContext.Provider>
		</GameActionsContext.Provider>
	);
};
