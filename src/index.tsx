import { createEffect, createSignal } from "solid-js";
import { render } from "solid-js/web";
import { Button, NormalButtonProps } from "ui/atoms/button";

import { Game } from "./game";

render(() => <Game />, document.getElementById("root") as HTMLElement);

// function Test() {
// 	const [color, setColor] = createSignal<NormalButtonProps["color"]>();
// 	createEffect(() => console.log(color()));

// 	return (
// 		<Button
// 			onClick={() =>
// 				setColor((["blue", "cyan", "green", "red"] as const)[Math.floor(Math.random() * 4)])
// 			}
// 			color={color()}
// 		>
// 			Test
// 		</Button>
// 	);
// }
