import { shade } from "polished";

import { mergeProps, onMount } from "solid-js";
import { css, keyframes } from "solid-styled-components";

export const gridUnitSize = 32;
const depth = 3;
const shapeSize = 27;
const shapeOffset = Math.floor((gridUnitSize - shapeSize - depth) / 2);
const iconOffset = Math.floor(-depth / 2);
const connectorOffset = shapeSize / 2 + shapeOffset;
const connectorWidth = 7;

interface PositionProps {
	x: number;
	y: number;
}

interface SegmentProps extends PositionProps {
	icon: string | null;
	color: string;
	connectRight?: boolean;
	connectDown?: boolean;
}
export const Segment = (props: SegmentProps) => {
	const p = mergeProps({ connectRight: false, connectDown: false }, props);

	const shadeColor = () => shade(0.5, p.color);
	return (
		<g transform={`translate(${p.x * gridUnitSize} ${p.y * gridUnitSize})`}>
			{p.connectRight && (
				<path
					fill="none"
					stroke={shadeColor()}
					stroke-width={connectorWidth}
					d={`M${connectorOffset},${
						connectorOffset + depth
					}h${gridUnitSize}`}
				/>
			)}
			{p.connectDown && (
				<path
					fill="none"
					stroke={shadeColor()}
					stroke-width={connectorWidth}
					d={`M${
						connectorOffset + depth
					},${connectorOffset}v${gridUnitSize}`}
				/>
			)}
			<path
				d={`M${
					shapeOffset + shapeSize
				},${shapeOffset}l${depth},${depth}v${shapeSize}h${-shapeSize}l${-depth},${-depth}`}
				fill={shadeColor()}
			/>

			{p.connectRight && (
				<path
					fill="none"
					stroke={p.color}
					stroke-width={connectorWidth}
					d={`M${connectorOffset},${connectorOffset}h${gridUnitSize}`}
				/>
			)}
			{p.connectDown && (
				<path
					fill="none"
					stroke={p.color}
					stroke-width={connectorWidth}
					d={`M${connectorOffset},${connectorOffset}v${gridUnitSize}`}
				/>
			)}
			<g clip-path={`url(#segment-clipPath-${"square"})`}>
				<rect
					x={0}
					y={0}
					width={gridUnitSize}
					height={gridUnitSize}
					fill={p.color}
				/>
				{p.icon && (
					<image href={p.icon} x={iconOffset} y={iconOffset} />
				)}
			</g>
		</g>
	);
};

export const SegmentClipPath = () => {
	return (
		<clipPath id={`segment-clipPath-${"square"}`}>
			<rect
				x={shapeOffset}
				y={shapeOffset}
				width={shapeSize}
				height={shapeSize}
			/>
		</clipPath>
	);
};

interface CellSelectionIndicatorProps extends PositionProps {
	ref?: (el: SVGGraphicsElement) => void;
}
export const CellSelectionIndicator = (p: CellSelectionIndicatorProps) => {
	return (
		<rect
			ref={p.ref}
			class={selectionIndicatorStyles}
			transform={`translate(${p.x * gridUnitSize} ${p.y * gridUnitSize})`}
			x={1}
			y={1}
			width={gridUnitSize - 2}
			height={gridUnitSize - 2}
		/>
	);
};
const selectionIndicatorStyles = css`
	fill: none;
	stroke: #fff;
	stroke-width: 2;
	animation: 530ms infinite ${keyframes`to { stroke: transparent; }`};
	pointer-events: none;
`;
