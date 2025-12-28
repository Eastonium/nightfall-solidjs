import { createContext, useContext } from "solid-js";
import {
	createStore,
	produce,
	reconcile,
	SetStoreFunction,
	unwrap,
} from "solid-js/store";
import { MapNode } from "../map/mapNode";

export interface SaveData {
	completedNodes: number[];
	revealedNodes: number[];
	programs: Record<string, number>;
}

export type Selectors = ReturnType<typeof createSelectors>;
export type Actions = ReturnType<typeof createActions>;

const STORAGE_KEY = "nightfall_save_data";
``;
// Default/empty save data
const defaultSaveData: SaveData = {
	completedNodes: [0],
	revealedNodes: [4],
	programs: {
		"nightfall:hack_2": 1,
		"nightfall:golem_1": 1,
		"nightfall:seeker_1": 2,
		"nightfall:turbo_1": 2,
		"nightfall:bug_1": 3,
		"nightfall:data_doctor_1": 1,
		"nightfall:bit_man": 2,
	},
};

export const SaveDataContext =
	createContext<ReturnType<typeof createSaveDataStore>>();

export const useSaveData = () => {
	const saveData = useContext(SaveDataContext);
	if (!saveData) {
		throw Error("useSaveData must be used with a SaveDataContext provider");
	}
	return saveData;
};

export const createSaveDataStore = () => {
	// Load from localStorage or use default
	const loadedData = (() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			return stored ? JSON.parse(stored) : defaultSaveData;
		} catch {
			return defaultSaveData;
		}
	})();

	const [saveData, setSaveData] = createStore<SaveData>(loadedData);
	const selectors = createSelectors(saveData);
	const actions = createActions(selectors, setSaveData);

	return [selectors, actions] as const;
};

const createSelectors = (saveData: SaveData) => {
	const isNodeCompleted = (node: MapNode) =>
		saveData.completedNodes.includes(node.id);

	const isNodeAccessible = (node: MapNode) =>
		node.unlockDeps.every(isNodeCompleted);

	return {
		saveData,
		isNodeCompleted,
		isNodeAccessible,
		isNodeRevealed: (node: MapNode) =>
			saveData.revealedNodes.includes(node.id) || isNodeAccessible(node),
	};
};

const createActions = (
	{ saveData }: Selectors,
	setSaveData: SetStoreFunction<SaveData>
) => {
	const persist = () => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(unwrap(saveData)));
		} catch {
			console.warn("Failed to persist save data to localStorage");
		}
	};

	const actions = {
		completeNode,
		revealNode,
		addProgram,
		removeProgram,
		setProgramCount,
		clearSaveData,
	};

	function completeNode(NodeId: number) {
		setSaveData(
			produce((data) => {
				if (!data.completedNodes.includes(NodeId)) {
					data.completedNodes.push(NodeId);
				}
			})
		);
		persist();
	}

	function revealNode(NodeId: number) {
		setSaveData(
			produce((data) => {
				if (!data.revealedNodes.includes(NodeId)) {
					data.revealedNodes.push(NodeId);
				}
			})
		);
		persist();
	}

	function addProgram(programId: string, count: number = 1) {
		setSaveData(
			produce((data) => {
				data.programs[programId] =
					(data.programs[programId] || 0) + count;
			})
		);
		persist();
	}

	function removeProgram(programId: string, count: number = 1) {
		setSaveData(
			produce((data) => {
				const existing = data.programs[programId];
				if (existing <= count) delete data.programs[programId];
				else data.programs[programId] = existing - count;
			})
		);
		persist();
	}

	function setProgramCount(programId: string, count: number) {
		setSaveData(
			produce((data) => {
				if (count > 0) data.programs[programId] = count;
				else delete data.programs[programId];
			})
		);
		persist();
	}

	function clearSaveData() {
		setSaveData(reconcile(defaultSaveData));
		localStorage.removeItem(STORAGE_KEY);
	}

	return actions;
};
