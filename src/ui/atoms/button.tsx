import { JSX, Component, mergeProps, splitProps } from "solid-js";
import { css, styled } from "solid-styled-components";
import { desaturate, darken } from "polished";

import { Fonts } from "ui/fonts";

const buttonColors = {
	blue: "#1348E7",
	cyan: "#0088CC",
	green: "#3cd515",
	red: "#F5042F",
};

const getGradientColors = (color: string, active: boolean) => {
	if (!active) color = desaturate(0.5, color);
	return [color, darken(0.8, color)];
};

interface ButtonWrapperProps {
	fill?: boolean;
}
const ButtonWrapper = styled("div")<ButtonWrapperProps>`
	display: ${(p) => (p.fill ? "block" : "inline-block")};
`;

//////////////////////////////////////////////////////////////////////////////////

interface ButtonProps
	extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
		ButtonWrapperProps {
	bold?: boolean;
	color?: keyof typeof buttonColors;
	big?: boolean;
	wrapperProps?: JSX.HTMLAttributes<HTMLDivElement>;
}
export type { ButtonProps as NormalButtonProps };
const NormalButton: Component<ButtonProps> = (props) => {
	const [p, buttonProps] = splitProps(
		mergeProps(
			{ fill: false, bold: false, big: false, wrapperProps: {} },
			props
		),
		["color", "fill", "wrapperProps", "children"]
	);

	return (
		<ButtonWrapper fill={p.fill} {...p.wrapperProps}>
			<NormalStyledButton color={p.color ?? "blue"} {...buttonProps}>
				<span>{p.children}</span>
			</NormalStyledButton>
		</ButtonWrapper>
	);
};
export { NormalButton as Button };
const NormalStyledButton = styled("button")<{
	bold: boolean;
	color: keyof typeof buttonColors;
	big: boolean;
}>`
	${(p) => (p.bold ? Fonts.O4b_25 : "")};
	width: 100%;
	border: 1px solid;
	border-image: linear-gradient(to bottom right, #fff, #aaa 10%, #222 85%) 1;
	padding: 1px;
	box-shadow: inset 0 0 0 1px #666;
	color: #fff;
	text-transform: ${(p) => (p.bold ? "lowercase" : "uppercase")};

	> span {
		display: flex;
		justify-content: center;
		align-items: center;
		height: ${(p) => (p.big ? 24 : 16)}px;
		border: 1px solid;
		border-image: linear-gradient(to top left, #eee, #999 10%, #111 85%) 1;
		padding: 0 12px;
		background: linear-gradient(
			to bottom right,
			${(p) => getGradientColors(buttonColors[p.color], false).join(", ")}
		);
	}

	&:enabled {
		cursor: pointer;

		&:hover,
		&:focus {
			> span {
				background: linear-gradient(
					to bottom right,
					${(p) =>
						getGradientColors(buttonColors[p.color], true).join(
							", "
						)}
				);
			}
		}
	}
	&:disabled {
		color: #ddd;

		& > span {
			background: linear-gradient(to bottom right, #666, #222);
		}
	}
`;

//////////////////////////////////////////////////////////////////////////////////

export interface MetalButtonProps
	extends JSX.ButtonHTMLAttributes<HTMLButtonElement>,
		ButtonWrapperProps {
	dark?: boolean;
	small?: boolean;
	wrapperProps?: JSX.HTMLAttributes<HTMLDivElement>;
}
export const MetalButton: Component<MetalButtonProps> = (props) => {
	const [p, buttonProps] = splitProps(
		mergeProps(
			{ fill: false, dark: false, small: false, wrapperProps: {} },
			props
		),
		["fill", "wrapperProps"]
	);
	return (
		<ButtonWrapper fill={p.fill} {...p.wrapperProps}>
			<MetalStyledButton {...buttonProps} />
		</ButtonWrapper>
	);
};
const MetalStyledButton = styled("button")<{ dark: boolean; small: boolean }>`
	position: relative;
	${Fonts.Abstract};
	${(p) => (p.small ? `fontSize: 8px;` : "")};
	width: 100%;
	height: ${(p) => (p.small ? "12px" : "20px")};
	padding: ${(p) => (p.small ? "0 8px 1px 7px" : "0 10px 1px 9px")};
	border-width: 1px 0 0 1px;
	border-style: solid;
	border-image: linear-gradient(
			${(p) => (p.dark ? "#68719C , #31384E" : "#EEE, #999")}
		)
		1;
	${(p) =>
		p.dark
			? css({ color: "#E0E2EB" })
			: css({ textShadow: "0px 1px #FFFB" })}
	background: linear-gradient(${(p) =>
		p.dark ? "#52597D, #282E40" : "#DDD, #777"});

	&::after {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		border-width: 0 1px 1px 0;
		border-style: solid;
		border-image: linear-gradient(
				${(p) => (p.dark ? "#444B69, #212635" : "#BBB, #555")}
			)
			1;
	}

	&:enabled {
		cursor: pointer;

		&:hover,
		&:focus {
			border-image: linear-gradient(
					${(p) =>
						p.dark ? "#334ED1 , #14286C" : "#FFF, #CDE1FE, #669EFF"}
				)
				1;
			${(p) =>
				p.dark
					? css({ color: "#E0E2EB" })
					: css({ textShadow: "0px 1px #FFFB" })}
			background: linear-gradient(${(p) =>
				p.dark ? "#273DAA, #102156" : "#ECFCFC, #76ABFC, #2674FF"});

			&::after {
				border-image: linear-gradient(
						${(p) =>
							p.dark
								? "#20348D, #0D1C49"
								: "#7BEAEA, #1E76FA, #0054E6"}
					)
					1;
			}
		}
	}
	&:disabled {
		color: ${(p) => (p.dark ? "#282E40" : "#777")};
		text-shadow: 0px 1px ${(p) => (p.dark ? "#FFF1" : "#FFF3")};
	}
`;
