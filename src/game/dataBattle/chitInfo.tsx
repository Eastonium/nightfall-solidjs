import { createEffect, createSignal, For, on, Show } from "solid-js";

import { Fonts } from "ui/fonts";
import { Segment, gridUnitSize } from "./grid/segment";
import { Chit } from "./chit";
import { Command, isProgram, Program } from "./program";
import { css, styled } from "solid-styled-components";

interface ChitInfoProps {
	chit: Chit | Program;
}
export const ChitInfo = (p: ChitInfoProps) => {
	const programCommands = isProgram(p.chit) ? p.chit.commands : null;
	const [selectedCommand, setSelectedCommand] = createSignal<Command | null>(
		null
	);

	createEffect(
		on(
			() => p.chit,
			() => void setSelectedCommand(null)
		)
	);

	return (
		<ChitInfoContainer>
			<BasicInfoContainer>
				{isProgram(p.chit) ? (
					<>
						<svg class={iconStyleClass}>
							<Segment
								column={0}
								row={0}
								icon={p.chit.icon}
								color={p.chit.color}
							/>
						</svg>
						<span>Move: {p.chit.speed}</span>
						<span>Max Size: {p.chit.maxSize}</span>
						<span>Current Size: {p.chit.slug.length}</span>
					</>
				) : (
					<img
						src={p.chit.icon}
						alt={p.chit.name}
						class={iconStyleClass}
					/>
				)}
			</BasicInfoContainer>
			<span class={h1StyleClass}>{p.chit.name}</span>
			<span class={pStyleClass}>{p.chit.desc}</span>
			{isProgram(p.chit) && (
				<>
					<span class={h2StyleClass}>Commands</span>
					<CommandContainer>
						<For each={programCommands}>
							{(command) => (
								<button
									onClick={() => setSelectedCommand(command)}
								>
									{command.name}
								</button>
							)}
						</For>
					</CommandContainer>
					<Show when={selectedCommand()} keyed>
						{(selectedCommand) => (
							<span class={pStyleClass}>
								{selectedCommand.name}:
								<br />
								{selectedCommand.desc ||
									"<Command description not found>"}
							</span>
						)}
					</Show>
				</>
			)}
		</ChitInfoContainer>
	);
};
const ChitInfoContainer = styled("div")`
	width: 120px;
	padding: 4px;
`;
const BasicInfoContainer = styled("div")`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: center;
	height: ${gridUnitSize.toString()}px;
	margin-bottom: 6px;
`;
const CommandContainer = styled("div")`
	margin: 0 -4px 4px;

	button {
		display: block;
		width: 100%;
		line-height: 20px;
		text-transform: uppercase;
		background: #fff4;
		cursor: pointer;

		&:hover {
			text-decoration: underline;
		}
	}
`;

const iconStyleClass = css`
	width: ${gridUnitSize.toString()}px;
	height: ${gridUnitSize.toString()}px;
	margin-right: 6px;
`;
const h1StyleClass = css`
	display: block;
	${Fonts.O4b_25};
	margin-bottom: 2px;
`;
const h2StyleClass = css`
	display: block;
	${Fonts.O4b_25};
	margin-bottom: 2px;
	text-transform: uppercase;
	color: #ccc;
`;
const pStyleClass = css`
	display: block;
	text-transform: uppercase;
	margin: 0;
	margin-bottom: 8px;
`;
