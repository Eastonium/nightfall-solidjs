import { For } from "solid-js";
import { css } from "solid-styled-components";

import { getProgramConfig } from "game/game";
import { Window, WindowProps } from "ui/atoms/window";
import { useDataBattle } from "../store";

export const ProgramListWindow = (props: Pick<WindowProps, "ref">) => {
	const [, { selectListedProgram }] = useDataBattle();

	return (
		<Window title="program.list" /* height={128}*/ {...props}>
			<Window.Section class={programListClass}>
				<For
					each={[
						"nightfall:hack_2",
						"nightfall:golem_1",
						"nightfall:seeker_1",
						"nightfall:turbo_1",
						"nightfall:bug_1",
						"nightfall:data_doctor_1",
						"nightfall:bit_man",
					]}
				>
					{(name) => {
						const program = getProgramConfig(name);
						if (!program)
							throw `Could not find program with name ${name}`;
						return (
							<button
								class={programListItemClass}
								onClick={() => selectListedProgram(program)}
							>
								{program.name}
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
