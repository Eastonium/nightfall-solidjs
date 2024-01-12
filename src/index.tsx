import "solid-devtools";
import { render } from "solid-js/web";

import { Game } from "./game";

render(() => <Game />, document.getElementById("root") as HTMLElement);
