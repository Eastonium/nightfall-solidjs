import { getProgramConfig } from "game/game";
import { For } from "solid-js";
import { css } from "solid-styled-components";
import { Window } from "ui/atoms/window";
import { useDataBattle } from "./store";

export const ProgramList = () => {
	const [, { selectListedProgram }] = useDataBattle();

	return (
		<Window title="program.list" height={128}>
			<Window.Section class={programListClass}>
				<For
					each={[
						"nightfall:hack_1",
						"nightfall:slingshot",
						"nightfall:bit_man",
					]}
				>
					{(name) => {
						const program = getProgramConfig(name)!;
						return (
							<button
								class={programListItemClass}
								onClick={() => selectListedProgram(program)}
							>
								{program.name} x{1}
							</button>
						);
					}}
				</For>
			</Window.Section>
		</Window>
	);
};

const programListClass = css`
	padding: 2px;
	overflow-y: auto;
`;

const programListItemClass = css`
	display: block;
	margin: 1px 0;
	cursor: pointer;

	&:hover {
		text-decoration: underline;
	}
`;
