import { For, Match, Show, Switch } from "solid-js";
import { css, styled } from "solid-styled-components";

import { Fonts } from "ui/fonts";
import { Segment, gridUnitSize } from "./grid/segment";
import { isProgramInstance, Program, ProgramConfig } from "./program";
import { Selection, useDataBattle } from "./store";
import { Button } from "ui/atoms/button";
import { Position } from "./grid/position";

const dummyPosition = new Position(0, 1, 1);

interface ChitInfoProps {
	selection: NonNullable<Selection>;
}
export const ChitInfo = (p: ChitInfoProps) => (
	<ChitInfoContainer>
		<BasicInfoContainer>
			<Switch>
				<Match when={p.selection.program} keyed>
					{(program) => (
						<>
							<svg class={iconStyleClass}>
								<Segment
									position={dummyPosition}
									icon={program.icon}
									color={program.color}
								/>
							</svg>
							<span>Speed: {program.speed}</span>
							<span>Max Size: {program.maxSize}</span>
							{isProgramInstance(program) && (
								<span>Current Size: {program.slug.length}</span>
							)}
						</>
					)}
				</Match>
				<Match when={p.selection.chit} keyed>
					{(chit) => (
						<img
							src={chit.icon}
							alt={chit.name}
							class={iconStyleClass}
						/>
					)}
				</Match>
			</Switch>
		</BasicInfoContainer>
		<span class={h1StyleClass}>
			{p.selection.chit?.name ?? p.selection.program?.name}
		</span>
		<span class={pStyleClass}>
			{p.selection.chit?.desc ?? p.selection.program?.desc}
		</span>
		<Show when={p.selection.program} keyed>
			{(program) => (
				<>
					<span class={h2StyleClass}>Commands</span>
					<Commands program={program} />
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

const ChitInfoContainer = styled("div")`
	width: 120px;
	padding: 4px;
`;
const BasicInfoContainer = styled("div")`
	display: flex;
	flex-direction: column;
	flex-wrap: wrap;
	justify-content: center;
	align-content: flex-start;
	height: ${gridUnitSize.toString()}px;
	margin-bottom: 6px;
`;

const Commands = (p: { program: ProgramConfig | Program }) => {
	const [{ dataBattle }, { setSelection, runProgramCommand }] =
		useDataBattle();

	const canAct = () =>
		dataBattle.phase.name === "turn" &&
		!dataBattle.phase.team.ai &&
		isProgramInstance(p.program) &&
		dataBattle.phase.team.id === p.program.team &&
		!p.program.usedAction;

	return (
		<CommandContainer>
			<For each={p.program.commands}>
				{(command) => (
					<Show
						when={canAct()}
						fallback={
							<CommandViewButton
								onClick={() =>
									setSelection({
										program: p.program,
										command,
									})
								}
							>
								{command.name}
							</CommandViewButton>
						}
					>
						<Button
							fill
							onClick={() =>
								setSelection({ program: p.program, command })
							}
						>
							{command.name}
						</Button>
					</Show>
				)}
			</For>
			<Show when={canAct()}>
				<Button
					fill
					onClick={() =>
						runProgramCommand(p.program as Program, null)
					}
				>
					No Action
				</Button>
			</Show>
		</CommandContainer>
	);
};
const CommandContainer = styled("div")`
	margin: 0 -4px 4px;
`;
const CommandViewButton = styled("button")`
	display: block;
	width: 100%;
	line-height: 20px;
	text-transform: uppercase;
	background: #fff4;
	cursor: pointer;

	&:hover {
		text-decoration: underline;
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
