import { createEffect, Show, splitProps } from "solid-js";
import { css, styled } from "solid-styled-components";

import { Button, NormalButtonProps } from "ui/atoms/button";
import { Window, WindowProps } from "ui/atoms/window";
import { Fonts } from "ui/fonts";

import { ChitInfo } from "./chitInfo";
import { Grid } from "./grid";
import type { Level } from "./level";
import { ProgramList } from "./programList";
import { createDataBattleStore, DataBattleContext } from "./store";
import { timing } from "./timings";

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

	// Ref the window and show it briefly after every team turn switch
	let turnChangeWindowRef: HTMLDivElement;
	createEffect(() => {
		if (dataBattle.phase.name !== "turn") return;
		dataBattle.phase.team.id;
		turnChangeWindowRef.animate(
			[{ visibility: "visible" }],
			timing.turnChangeWindowDuration
		);
	});

	let creditsCollectedWindowRef: HTMLDivElement | undefined;
	let creditsCollectedWindowSectionRef: HTMLDivElement | undefined;
	let cellSelectionIndicatorRef: SVGGraphicsElement | undefined;
	createEffect<number>((prevCredits) => {
		if (!dataBattle.creditsCollected) return 0;

		const creditWindowBB =
			creditsCollectedWindowRef!.getBoundingClientRect();
		const creditCellBB = cellSelectionIndicatorRef!.getBoundingClientRect();
		// debugger;
		creditsCollectedWindowRef!.style.top =
			creditCellBB.top +
			(creditCellBB.height - creditWindowBB.height) / 2 +
			"px";
		creditsCollectedWindowRef!.style.left =
			creditCellBB.left +
			(creditCellBB.width - creditWindowBB.width) / 2 +
			"px";

		creditsCollectedWindowRef!.animate(
			[{ visibility: "visible" }],
			timing.creditsCollectedWindowDuration
		);
		creditsCollectedWindowRef!.animate(
			[
				{ opacity: 0, transform: "scale(0.5)" },
				{ opacity: 1, transform: "scale(1)" },
			],
			timing.creditsCollectedEntranceEffectDuration
		);
		creditsCollectedWindowSectionRef!.innerText =
			dataBattle.creditsCollected - prevCredits + " Credits";
		return dataBattle.creditsCollected;
	}, 0);

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

					<Grid
						cellSelectionIndicatorRef={(el) => {
							cellSelectionIndicatorRef = el;
						}}
						class={gridStyleClass}
					/>

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

					{/* Turn Change Window */}
					<Show
						when={
							dataBattle.phase.name === "turn" && dataBattle.phase
						}
						keyed
					>
						{(phase) => (
							<Window
								ref={turnChangeWindowRef}
								class={centeredInfoWindowClass}
								title="phase.sequence"
								width={190}
								height={90}
								style={{ visibility: "hidden" }}
							>
								<CenteredThickTextWindowSection>
									{phase.team.id === 0 ? "Your" : "Enemy"}{" "}
									Turn
								</CenteredThickTextWindowSection>
							</Window>
						)}
					</Show>

					{/* Credit Pickup Window */}
					<Window
						ref={creditsCollectedWindowRef}
						title="credits.amt"
						width={128}
						height={128}
						style={{ position: "fixed", visibility: "hidden" }}
					>
						<CenteredThickTextWindowSection
							ref={creditsCollectedWindowSectionRef}
						/>
					</Window>

					{/* Databattle Result Window */}
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
									<ResultWindowSection>
										<header>Databattle Successful</header>
										<p>
											Mission credits awarded:{" "}
											{dataBattle.creditReward}
										</p>
										<p>
											Extra credits acquired:{" "}
											{dataBattle.creditsCollected}
										</p>
									</ResultWindowSection>
								) : (
									<ResultWindowSection>
										<header>Databattle Unsuccessful</header>
										<p>Connection terminated...</p>
									</ResultWindowSection>
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
const CenteredThickTextWindowSection = styled(Window.Section)`
	display: flex;
	align-items: center;
	justify-content: center;
	${Fonts.O4b_25};
	text-transform: uppercase;
`;
const ResultWindowSection = styled(Window.Section)`
	padding: 16px 12px;
	text-transform: uppercase;

	header {
		${Fonts.O4b_25};
	}
`;
