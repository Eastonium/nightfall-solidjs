import { createEffect, createSignal } from "solid-js";
import { styled } from "solid-styled-components";
import usePopper from "solid-popper";

import { Window } from "ui/atoms/window";
import { useDataBattle } from "../store";

export const SetupTutorial = (props: {
	dataBattleWindowRef: HTMLDivElement | undefined;
	programListWindowRef: HTMLDivElement | undefined;
}) => {
	const [{ dataBattle }] = useDataBattle();

	const [tutorialTooltipRef, setTutorialTooltipRef] =
		createSignal<HTMLDivElement>();
	const tutorialTooltipTargetRef = () => {
		if (dataBattle.uploadZones.find((uz) => uz.program)) return undefined;
		if (dataBattle.selection?.chit?.id === "upload_zone")
			return props.programListWindowRef;
		return document.querySelector<HTMLElement>(
			`[data-battle-id="${dataBattle.id}"] [data-ref="upload-zone"]`
		);
	};
	const popperInstance = usePopper(
		tutorialTooltipTargetRef,
		tutorialTooltipRef
	);
	createEffect(() => {
		const instance = popperInstance();
		if (!instance) return;
		// Options have to be set both after a animation frame has occurred for the SVG to be properly measured and  because the dataBattleWindowRef isn't set until it is mounted
		requestAnimationFrame(() => {
			instance.setOptions({
				placement: "right",
				modifiers: [
					{ name: "offset", options: { offset: [0, 8] } },
					{
						name: "flip",
						options: {
							fallbackPlacements: ["left"],
							boundary: props.dataBattleWindowRef,
						},
					},
					// This is here to replace 3d transforms with 2d ones
					{
						name: "applyStyles",
						// @ts-ignore
						fn({ state }) {
							// Manually assign attributes
							state.elements.popper.setAttribute(
								"data-popper-placement",
								state.attributes.popper["data-popper-placement"]
							);

							// Manually assign styles
							const { transform, ...popperStyles } =
								state.styles.popper;
							Object.assign(
								state.elements.popper.style,
								popperStyles,
								{
									transform: transform?.includes("3d")
										? `translate(${transform?.slice(
												transform.indexOf("(") + 1,
												transform.lastIndexOf(",")
										  )})`
										: transform,
								}
							);
						},
					},
				],
			});
		});
	});

	return (
		<HintBar
			ref={setTutorialTooltipRef}
			title={(dataBattle.selection?.chit?.id === "upload_zone"
				? "Select a program to upload to this location"
				: "Click on an upload zone to begin"
			).toUpperCase()}
		/>
	);
};
const HintBar = styled(Window)`
	position: absolute;
	visibility: hidden;

	&[data-popper-placement] {
		visibility: visible;
	}
	& [data-ref="title-bar"]::before {
		content: " ";
		display: block;
		width: 15px;
		height: 15px;
		margin-left: -6px;
		background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg"><path d="M10,1.5 l-6,6 l6,6" fill="white"/></svg>');
	}
	&[data-popper-placement="left"] [data-ref="title-bar"]::before {
		order: 9999;
		transform: scale(-1, 1);
		margin-left: 0;
		margin-right: -6px;
	}
`;
