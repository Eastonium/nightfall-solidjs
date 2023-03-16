import { createContext, Show, splitProps, useContext } from "solid-js";
import { createStore } from "solid-js/store";
import { css, styled } from "solid-styled-components";

import { Button } from "ui/atoms/button";
import { Window, WindowProps } from "ui/atoms/window";

import { ChitInfo } from "./chitInfo";
import { Grid } from "./grid";
import type { Level, Selection } from "./level";

import spybotImage from "assets/packs/nightfall/textures/spybots/Snaptrax S45.png";

const DataBattleContext = createContext<
	ReturnType<typeof createStore<Level & { selection: Selection }>> | undefined
>();
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

	const levelStore = createStore(
		Object.assign<Level, { selection: Selection }>(p.level, {
			selection: null,
		})
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
						<Show when={levelStore[0].selection} keyed>
							{(selection) => <ChitInfo selection={selection} />}
						</Show>
					</Window>
					{/* <Button bold wrapperProps={{ class: beginButtonStyleClass }}>
					Begin Databattle
				</Button> */}
					<Grid class={gridStyleClass} />
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
