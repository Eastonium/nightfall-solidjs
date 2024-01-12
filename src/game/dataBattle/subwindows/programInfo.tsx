import { Show } from "solid-js";
import { css } from "solid-styled-components";

import { Button, NormalButtonProps } from "ui/atoms/button";
import { Window } from "ui/atoms/window";
import { ChitInfo } from "../chitInfo";
import { useDataBattle } from "../store";

export const ProgramInfoWindow = () => {
	const [
		{ dataBattle, selectionPosition, rollbackStates },
		{ clearUploadZone, rollbackState },
	] = useDataBattle();

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
			class={css({ gridRow: 2 })}
			title="program.info"
			sectioned
			postFooter={<Button fill bold {...programInfoButtonProps} />}
		>
			<Show when={dataBattle.selection} keyed>
				{(selection) => <ChitInfo selection={selection} />}
			</Show>
		</Window>
	);
};
