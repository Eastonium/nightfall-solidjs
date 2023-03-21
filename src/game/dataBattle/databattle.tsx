import { getTexture } from "game/game";
import { createEffect, Show, splitProps } from "solid-js";
import { css, styled } from "solid-styled-components";

import { Button } from "ui/atoms/button";
import { Window, WindowProps } from "ui/atoms/window";

import { ChitInfo } from "./chitInfo";
import { Grid } from "./grid";
import type { Level } from "./level";
import { createDataBattleStore, DataBattleContext } from "./store";

interface DataBattleProps extends WindowProps {
	level: Level;
}
export const DataBattle = (props: DataBattleProps) => {
	const [p, windowProps] = splitProps(props, ["level"]);

	const dataBattleStore = createDataBattleStore(p.level);

	return (
		<Window
			title="databattle in progress"
			titleBarButtonProps={{ children: "log out" }}
			sectioned
			{...windowProps}
		>
			<LayoutContainer>
				<DataBattleContext.Provider value={dataBattleStore}>
					<Window title="spybot" sectioned>
						<img
							src={getTexture("nightfall:snaptraxS45")}
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
						<Show when={dataBattleStore[0].selection} keyed>
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
