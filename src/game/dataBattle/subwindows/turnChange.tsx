import { Show, createEffect } from "solid-js";
import { css, styled } from "solid-styled-components";

import { Window } from "ui/atoms/window";
import { Fonts } from "ui/fonts";
import { timing } from "../timings";
import { useDataBattle } from "../store";

export const TurnChangeWindow = (props: {
	centeredWindowClass: ReturnType<typeof css>;
}) => {
	const [{ dataBattle }] = useDataBattle();

	// Ref the window and show it briefly after every team turn switch
	let turnChangeWindowRef: HTMLDivElement;
	createEffect(() => {
		if (dataBattle.phase.name !== "turn") return;
		dataBattle.phase.team.id;
		dataBattle.phase.turn;
		turnChangeWindowRef.animate(
			[{ visibility: "visible" }],
			timing.turnChangeWindowDuration
		);
	});

	return (
		<Show when={dataBattle.phase.name === "turn" && dataBattle.phase} keyed>
			{(phase) => (
				<Window
					ref={turnChangeWindowRef}
					class={props.centeredWindowClass}
					title="phase.sequence"
					width={190}
					height={90}
					style={{ visibility: "hidden" }}
				>
					<CenteredThickTextWindowSection>
						{phase.team.id === 0 ? "Your" : "Enemy"} Turn
					</CenteredThickTextWindowSection>
				</Window>
			)}
		</Show>
	);
};
const CenteredThickTextWindowSection = styled(Window.Section)`
	display: flex;
	align-items: center;
	justify-content: center;
	${Fonts.O4b_25};
	text-transform: uppercase;
`;
