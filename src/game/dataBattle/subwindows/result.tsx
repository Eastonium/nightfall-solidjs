import { Show } from "solid-js";
import { css, styled } from "solid-styled-components";

import { Button } from "ui/atoms/button";
import { Window } from "ui/atoms/window";
import { Fonts } from "ui/fonts";
import { useDataBattle } from "../store";

export const DatabattleResultWindow = (props: {
	centeredWindowClass: ReturnType<typeof css>;
}) => {
	const [{ dataBattle }] = useDataBattle();

	return (
		<Show when={dataBattle.phase.name === "end" && dataBattle.phase} keyed>
			{(phase) => (
				<Window
					class={props.centeredWindowClass}
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
	);
};
const ResultWindowSection = styled(Window.Section)`
	padding: 16px 12px;
	text-transform: uppercase;

	header {
		${Fonts.O4b_25};
	}
`;
