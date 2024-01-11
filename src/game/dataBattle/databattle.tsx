import { Show, splitProps } from "solid-js";
import { css, styled } from "solid-styled-components";

import { Button, NormalButtonProps } from "ui/atoms/button";
import { Window, WindowProps } from "ui/atoms/window";

import { ChitInfo } from "./chitInfo";
import { Grid } from "./grid";
import type { Level } from "./level";
import { createDataBattleStore, DataBattleContext } from "./store";
import { ProgramListWindow } from "./subwindows/programList";
import { DatabattleResultWindow } from "./subwindows/result";
import { CreditPickupWindow } from "./subwindows/creditPickup";
import { TurnChangeWindow } from "./subwindows/turnChange";

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
			data-battle-id={dataBattle.id}
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
								<br />
								Credits: {dataBattle.creditsCollected}
								{/* <img
									src={getTexture("nightfall:snaptraxS45")}
									alt="spybot"
									style={{ display: "block" }}
								/> */}
							</Window>
						}
						keyed
					>
						<ProgramListWindow />
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

					<Show when={dataBattle.phase.name === "setup"}>
						<Button
							bold
							wrapperProps={{ class: beginButtonStyleClass }}
							disabled={
								// Check for at least one pre-set program
								!dataBattle.programs.find(
									(program) => program.team === 0 // TODO: Use this player's team number
								) &&
								// Check for at least one picked program
								!dataBattle.uploadZones.find((uz) => uz.program)
							}
							onClick={endSetup}
						>
							Begin DataBattle
						</Button>
					</Show>

					<TurnChangeWindow
						centeredWindowClass={centeredWindowClass}
					/>
					<CreditPickupWindow />
					<DatabattleResultWindow
						centeredWindowClass={centeredWindowClass}
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
`;
const gridStyleClass = css`
	grid-row: 1 / span 2;
	grid-column: 2;
	display: flex;
	justify-content: center;
	align-items: center;
`;

const centeredWindowClass = css`
	grid-row: 1 / 3;
	grid-column: 2;
	justify-self: center;
	align-self: center;
`;
