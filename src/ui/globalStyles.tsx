import { createGlobalStyles as css, glob } from "solid-styled-components";
import { Fonts } from "./fonts";

export const GlobalStyles = css`
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
`;
