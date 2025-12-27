import { For } from "solid-js";
import { css } from "solid-styled-components";

import { getProgramConfig } from "../../../game/game";
import { Window, WindowProps } from "../../../ui/atoms/window";
import { useDataBattle } from "../store";
import { useSaveData } from "../../saveData";

export const ProgramListWindow = (props: Pick<WindowProps, "ref">) => {
	const [, { selectListedProgram }] = useDataBattle();
	const [{ saveData }] = useSaveData();

	return (
		<Window title="program.list" /* height={128}*/ {...props}>
			<Window.Section class={programListClass}>
				<For each={Object.entries(saveData.programs)}>
					{([name, count]) => {
						const program = getProgramConfig(name);
						if (!program)
							throw `Could not find program with name ${name}`;
						return (
							<button
								class={programListItemClass}
								onClick={() => selectListedProgram(program)}
							>
								{program.name} x{count}
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
