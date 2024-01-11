import { createEffect } from "solid-js";
import { styled } from "solid-styled-components";

import { Window } from "ui/atoms/window";
import { Fonts } from "ui/fonts";
import { useDataBattle } from "../store";
import { timing } from "../timings";

export const CreditPickupWindow = () => {
	const [{ dataBattle }] = useDataBattle();

	let creditsCollectedWindowRef: HTMLDivElement | undefined;
	let creditsCollectedWindowSectionRef: HTMLDivElement | undefined;
	createEffect<number>((prevCredits) => {
		if (!dataBattle.creditsCollected) return 0;

		const creditWindowBB =
			creditsCollectedWindowRef!.getBoundingClientRect();
		const creditCellBB = document
			.querySelector(
				`[data-battle-id="${dataBattle.id}"] [data-ref="cursor"]`
			)!
			.getBoundingClientRect();

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
	);
};
const CenteredThickTextWindowSection = styled(Window.Section)`
	display: flex;
	align-items: center;
	justify-content: center;
	${Fonts.O4b_25};
	text-transform: uppercase;
`;
