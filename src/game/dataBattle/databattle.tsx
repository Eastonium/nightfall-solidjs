import {
	createContext,
	createSignal,
	Show,
	splitProps,
	useContext,
} from "solid-js";
import { createStore } from "solid-js/store";
import type {  } from "solid-js/store";
import { css, styled } from "solid-styled-components";

import { Button } from "ui/atoms/button";
import { Window, WindowProps } from "ui/atoms/window";

import { ChitInfo } from "./chitInfo";
import { Grid } from "./grid";

import spybotImage from "assets/packs/nightfall/textures/spybots/Snaptrax S45.png";
import { Chit } from "./chit";
import { Program } from "./program";
import type { Level } from "./level";

const DataBattleContext = createContext<ReturnType<typeof createStore<Level>> | undefined>();
export const useDataBattle = () => {
	const dataBattle = useContext(DataBattleContext);
	if (!dataBattle)
		throw Error(
			"useDataBattle must be used with a DataBattleContext provider"
		);
	return dataBattle;
};

interface DataBattleProps extends WindowProps {
	level: Level;
}
export const DataBattle = (props: DataBattleProps) => {
	const [p, windowProps] = splitProps(props, ["level"]);

	const levelStore = createStore(p.level);

	const [selectedChit, setSelectedChit] = createSignal<Chit | Program | null>(
		null
	);

	return (
		<Window
			title="databattle in progress"
			titleBarButtonProps={{ children: "log out" }}
			sectioned
			{...windowProps}
		>
			<LayoutContainer>
				<DataBattleContext.Provider value={levelStore}>
					<Window title="spybot" sectioned>
						<img
							src={spybotImage}
							alt="spybot"
							style={{ display: "block" }}
						/>
					</Window>
					<Window
						class={css({ gridRow: 2 })}
						title="program.info"
						sectioned
						postFooter={
							<Button color="red" fill bold>
								Undo
							</Button>
						}
					>
						<Show when={selectedChit()} keyed>
							{(selectedChit) => <ChitInfo chit={selectedChit} />}
						</Show>
					</Window>
					{/* <Button bold wrapperProps={{ class: beginButtonStyleClass }}>
					Begin Databattle
				</Button> */}
					<Grid
						class={gridStyleClass}
						selectedChit={selectedChit}
						setSelectedChit={setSelectedChit}
					/>
				</DataBattleContext.Provider>
			</LayoutContainer>
		</Window>
	);
};

const LayoutContainer = styled("div")`
	display: grid;
	grid-template: auto 1fr / auto 1fr;
	grid-gap: 4px;
	padding: 4px;
`;

const beginButtonStyleClass = css`
	grid-row: 2;
	grid-column: 2;
	align-self: flex-end;
	justify-self: flex-start;
	z-index: 1;
`;
const gridStyleClass = css`
	grid-row: 1 / span 2;
	grid-column: 2;
	display: flex;
	justify-content: center;
	align-items: center;
`;
