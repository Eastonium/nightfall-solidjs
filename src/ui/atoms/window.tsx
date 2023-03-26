import { children, JSX, mergeProps, splitProps } from "solid-js";
import { styled } from "solid-styled-components";

export interface WindowProps extends JSX.HTMLAttributes<HTMLDivElement> {
	x?: number;
	y?: number;
	width?: number;
	height?: number;
	title?: string;
	titleBarIcon?: JSX.Element;
	titleBarButtonProps?: JSX.ButtonHTMLAttributes<HTMLButtonElement>;
	sectioned?: boolean;
	postFooter?: JSX.Element;
}
const _Window = (props: WindowProps) => {
	const [p, containerProps] = splitProps(
		mergeProps({ x: 0, y: 0, sectioned: false }, props),
		[
			"x",
			"y",
			"width",
			"height",
			"title",
			"titleBarIcon",
			"titleBarButtonProps",
			"sectioned",
			"postFooter",
			"children",
		]
	);
	return (
		<WindowContainer
			style={{
				top: p.x + "px",
				left: p.y + "px",
				width: p.width + "px",
				height: p.height + "px",
			}}
			{...containerProps}
		>
			<div>
				<BarContainer hasIcon={!!p.titleBarIcon}>
					{p.titleBarIcon}
					{p.title && <div class="title">{p.title}</div>}
					{p.titleBarButtonProps && (
						<BarButtonContainer>
							<button {...p.titleBarButtonProps} />
						</BarButtonContainer>
					)}
				</BarContainer>
			</div>
			{p.children != null && (
				<>
					<ContentWrapper>
						{p.sectioned ? (
							<WindowSection>{p.children}</WindowSection>
						) : (
							p.children
						)}
					</ContentWrapper>
					<Footer />
				</>
			)}
			{p.postFooter && <div>{p.postFooter}</div>}
		</WindowContainer>
	);
};
const WindowSection = styled("div")`
	flex: 1 1 auto;
	margin: 1px;
	border: 1px solid;
	border-image: linear-gradient(to top left, #fff, #bbb 10%, #444 70%) 1;
	box-shadow: 0 0 0 1px #777;
`;
export const Window = Object.assign(_Window, { Section: WindowSection });

const WindowContainer = styled("div")`
	vertical-align: top;

	display: inline-flex;
	flex-direction: column;
	min-width: 128px;
	border: solid #000;
	border-width: 0 1px;

	pointer-events: all;

	> div {
		border-bottom: 1px solid #000;
	}
`;
const ContentWrapper = styled("div")`
	flex: 1 1 auto;
	display: flex;
	flex-direction: column;
	background: linear-gradient(#0008, transparent);
`;
const BarContainer = styled("div")<{ hasIcon: boolean }>`
	flex: 0 0 auto;
	height: 17px;
	border-width: 1px 0 0 1px;
	border-style: solid;
	border-image: linear-gradient(#eee, #999) 1;
	padding: 0 6px 0 8px;
	background: linear-gradient(#ddd, #777);
	color: #000;

	${(p) => (p.hasIcon ? "padding-left: 0;" : "")}

	> div {
		flex: 0 0 auto;
		display: inline-block;
		height: 15px;
		margin-top: -1px;
		border: 1px solid #ddd;
		border-top: 0;
		border-left-color: #555;
		background: linear-gradient(#282e40, #52597d);
		color: #fff;
		overflow: hidden;
		white-space: nowrap;

		&.title {
			flex-basis: 90px;
			padding: 3px 30px 0 4px;
		}
	}
`;
const BarButtonContainer = styled("div")`
	float: right;
	margin-left: 16px;
	padding: 0 1px;

	button {
		height: 12px;
		border: 1px solid #fff;
		border-right-color: #777;
		border-bottom-color: #777;
		padding: 0 13px;
		color: #000;
		text-shadow: 1px 1px #fff;
		text-transform: uppercase;
		background: linear-gradient(#fff, #bbb);
		box-shadow: 0 0 0 1px #0008;
		cursor: pointer;

		&:hover,
		&:focus {
			transform: translate(0, 1px);
		}
	}
`;
const Footer = styled("div")`
	height: 5px;
	border-top: 2px solid #fff;
	background: linear-gradient(90deg, #8a8a8a, #000);
`;

export const WindowsContainer = styled("div")<{ coverScreen?: boolean }>`
	position: ${(p) => (p.coverScreen ? "fixed" : "relative")};
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;

	> ${WindowContainer.class} {
		position: absolute;
	}
`;
