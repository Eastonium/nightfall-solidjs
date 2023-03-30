import { getTexture } from "game/game";
import { Show, splitProps } from "solid-js";
import { css, styled } from "solid-styled-components";

import { Button, NormalButtonProps } from "ui/atoms/button";
import { Window, WindowProps } from "ui/atoms/window";
import { Fonts } from "ui/fonts";

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
	const [
		{ dataBattle, selectionPosition, rollbackStates },
		{ clearUploadZone, endSetup, rollbackState },
	] = dataBattleStore;

	const programInfoButtonProps = (): NormalButtonProps => {
		if (dataBattle.phase.name === "setup") {
			const selectionPos = selectionPosition();
			return {
				color: "red",
				children: "Remove",
				innerSpanProps: { class: "fixPx" },
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
				disabled: rollbackStates().length < 1,
				onClick: rollbackState,
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
							<Window title="debug.phase" sectioned>
								Phase: {dataBattle.phase.name}
								<br />
								Team:{" "}
								{dataBattle.phase.name === "end"
									? dataBattle.phase.winner
									: dataBattle.phase.team.id}
								{/* <img
									src={getTexture("nightfall:snaptraxS45")}
									alt="spybot"
									style={{ display: "block" }}
								/> */}
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

					<Grid class={gridStyleClass} />

					<Show when={dataBattle.phase.name === "setup"} keyed>
						<Button
							bold
							wrapperProps={{ class: beginButtonStyleClass }}
							onClick={endSetup}
						>
							Begin DataBattle
						</Button>
					</Show>

					<Show
						when={
							dataBattle.phase.name === "end" && dataBattle.phase
						}
						keyed
					>
						{(phase) => (
							<Window
								class={centeredInfoWindowClass}
								title="databattle.result"
								width={250}
								height={150}
							>
								{phase.winner === 0 ? (
									<WindowInfoSection>
										<header>Databattle Successful</header>
										<p>
											Mission credits awarded:{" "}
											{dataBattle.creditReward}
										</p>
										<p>
											Extra credits acquired:{" "}
											{dataBattle.creditsCollected}
										</p>
									</WindowInfoSection>
								) : (
									<WindowInfoSection>
										<header>Databattle Unsuccessful</header>
										<p>Connection terminated...</p>
									</WindowInfoSection>
								)}
								<Button fill bold color="cyan">
									Log out
								</Button>
							</Window>
						)}
					</Show>
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
`;
const gridStyleClass = css`
	grid-row: 1 / span 2;
	grid-column: 2;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const centeredInfoWindowClass = css`
	grid-row: 1 / 3;
	grid-column: 2;
	justify-self: center;
	align-self: center;
`;
const WindowInfoSection = styled(Window.Section)`
	padding: 16px 12px;
	text-transform: uppercase;

	header {
		${Fonts.O4b_25};
	}
`;
