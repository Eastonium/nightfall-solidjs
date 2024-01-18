import { createGlobalStyles } from "solid-styled-components";
import { Fonts } from "./fonts";

export const GlobalStyles = createGlobalStyles`
	* {
		box-sizing: border-box;
		font-family: inherit;
		font-size: inherit;
		color: inherit;
		line-height: 1em;
	}

	:focus {
		outline: none;
	}

	html {
		width: 100%;
		height: 100%;
	}

	body {
		width: 100%;
		height: 100%;
		margin: 0;
		${Fonts.BitLight};
		font-smooth: never;
		-webkit-font-smoothing: none;
		image-rendering: pixelated;
		transform: translate(0,0); // Fixes font blur
		background: #000;
		color: #fff;
	}

	button {
		margin: 0;
		border: 0;
		border-radius: 0;
		padding: 0;
		background: none;
	}

	#root {
		height: 100%;
	}

	.fixPx::after {
		content: "\u200a\u200a"; // &hairsp;&hairsp;
	}
`;
