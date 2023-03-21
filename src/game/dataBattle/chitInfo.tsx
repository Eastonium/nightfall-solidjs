import { For, Show } from "solid-js";

import { Fonts } from "ui/fonts";
import { Segment, gridUnitSize } from "./grid/segment";
import { isProgram } from "./program";
import { css, styled } from "solid-styled-components";
import { Selection } from "./level";
import { useDataBattle } from "./store";

interface ChitInfoProps {
	selection: NonNullable<Selection>;
}
export const ChitInfo = (p: ChitInfoProps) => {
	const [, { setSelection }] = useDataBattle();

	const programCommands = () =>
		isProgram(p.selection.chit) ? p.selection.chit.commands : null;

	return (
		<ChitInfoContainer>
			<BasicInfoContainer>
				{isProgram(p.selection.chit) ? (
					<>
						<svg class={iconStyleClass}>
							<Segment
								column={0}
								row={0}
								icon={p.selection.chit.icon}
								color={p.selection.chit.color}
							/>
						</svg>
						<span>Move: {p.selection.chit.speed}</span>
						<span>Max Size: {p.selection.chit.maxSize}</span>
						<span>
							Current Size: {p.selection.chit.slug.length}
						</span>
					</>
				) : (
					<img
						src={p.selection.chit.icon}
						alt={p.selection.chit.name}
						class={iconStyleClass}
					/>
				)}
			</BasicInfoContainer>
			<span class={h1StyleClass}>{p.selection.chit.name}</span>
			<span class={pStyleClass}>{p.selection.chit.desc}</span>
			<Show when={isProgram(p.selection.chit) && p.selection.chit} keyed>
				{(program) => (
					<>
						<span class={h2StyleClass}>Commands</span>
						<CommandContainer>
							<For each={programCommands()}>
								{(command) => (
									<button
										onClick={() =>
											setSelection({
												chit: program,
												command,
											})
										}
									>
										{command.name}
									</button>
								)}
							</For>
						</CommandContainer>
						<Show when={p.selection.command} keyed>
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
			</Show>
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