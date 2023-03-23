import { getTexture } from "game/game";
import { Show, splitProps } from "solid-js";
import { css, styled } from "solid-styled-components";

import { Button, NormalButtonProps } from "ui/atoms/button";
import { Window, WindowProps } from "ui/atoms/window";

import { ChitInfo } from "./chitInfo";
import { Grid } from "./grid";
import type { Level } from "./level";
import { ProgramList } from "./programList";
import { createDataBattleStore, DataBattleContext } from "./store";

interface DataBattleProps extends WindowProps {
	level: Level;
}
export const DataBattle = (props: DataBattleProps) => {
	const [p, windowProps] = splitProps(props, ["level"]);

	const dataBattleStore = createDataBattleStore(p.level);
	const [{ dataBattle, selectionPosition }, { clearUploadZone, endSetup }] =
		dataBattleStore;

	const programInfoButtonProps = (): NormalButtonProps => {
		if (dataBattle.phase.name === "setup") {
			const selectionPos = selectionPosition();
			return {
				color: "red",
				children: "Remove",
				disabled:
					!selectionPos ||
					!dataBattle.uploadZones.find((uz) =>
						uz.pos.equals(selectionPos)
					)?.program,
				onClick: clearUploadZone,
			};
		} else
			return {
				color: "red",
				children: "Undo",
				disabled: true,
			};
	};

	return (
		<Window
			title="databattle in progress"
			titleBarButtonProps={{ children: "log out" }}
			sectioned
			{...windowProps}
		>
			<LayoutContainer>
				<DataBattleContext.Provider value={dataBattleStore}>
					<Show
						when={dataBattle.phase.name === "setup"}
						fallback={
							<Window title="spybot" sectioned>
								<img
									src={getTexture("nightfall:snaptraxS45")}
									alt="spybot"
									style={{ display: "block" }}
								/>
							</Window>
						}
						keyed
					>
						<ProgramList />
					</Show>

					<Window
						class={css({ gridRow: 2 })}
						title="program.info"
						sectioned
						postFooter={
							<Button fill bold {...programInfoButtonProps} />
						}
					>
						<Show when={dataBattle.selection} keyed>
							{(selection) => <ChitInfo selection={selection} />}
						</Show>
					</Window>
					<Show when={dataBattle.phase.name === "setup"} keyed>
						<Button
							bold
							wrapperProps={{ class: beginButtonStyleClass }}
							onClick={endSetup}
						>
							Begin DataBattle
						</Button>
					</Show>
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
