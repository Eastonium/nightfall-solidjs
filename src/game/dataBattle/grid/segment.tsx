import { shade } from "polished";

import { Show, mergeProps } from "solid-js";
import { css, keyframes } from "solid-styled-components";

import { Position } from "./position";
import { useDataBattle } from "../store";

export const gridUnitSize = 32;
const depth = 3;
const shapeSize = 27;
const shapeOffset = Math.floor((gridUnitSize - shapeSize - depth) / 2);
const iconOffset = Math.floor(-depth / 2);
const connectorOffset = shapeSize / 2 + shapeOffset;
const connectorWidth = 7;

interface SegmentProps {
	position: Position;
	icon: string | null;
	color: string;
	connectRight?: boolean;
	connectDown?: boolean;
}
export const Segment = (props: SegmentProps) => {
	const p = mergeProps({ connectRight: false, connectDown: false }, props);

	const rightPosSectorIndex = p.position.clone(1, 0).sectorIndex;
	const downPosSectorIndex = p.position.clone(0, 1).sectorIndex;
	const shadeColor = () => shade(0.5, p.color);
	return (
		<g
			transform={`translate(${p.position.x * gridUnitSize} ${
				p.position.y * gridUnitSize
			})`}
			data-pos={p.position.sectorIndex}
		>
			{p.connectRight && (
				<path
					fill="none"
					stroke={shadeColor()}
					stroke-width={connectorWidth}
					d={`M${connectorOffset},${
						connectorOffset + depth
					}h${gridUnitSize}`}
					data-pos={rightPosSectorIndex}
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
					data-pos={downPosSectorIndex}
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
					data-pos={rightPosSectorIndex}
				/>
			)}
			{p.connectDown && (
				<path
					fill="none"
					stroke={p.color}
					stroke-width={connectorWidth}
					d={`M${connectorOffset},${connectorOffset}v${gridUnitSize}`}
					data-pos={downPosSectorIndex}
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

interface CellSelectionIndicatorProps {
	ref?: SVGRectElement | ((el: SVGRectElement) => void);
}
export const CellSelectionIndicator = (p: CellSelectionIndicatorProps) => {
	const [{ selectionPosition }] = useDataBattle();

	return (
		<Show when={selectionPosition()}>
			<rect
				ref={p.ref}
				class={selectionIndicatorStyles}
				transform={`translate(${
					selectionPosition()!.x * gridUnitSize
				} ${selectionPosition()!.y * gridUnitSize})`}
				x={1}
				y={1}
				width={gridUnitSize - 2}
				height={gridUnitSize - 2}
			/>
		</Show>
	);
};
const selectionIndicatorStyles = css`
	fill: none;
	stroke: #fff;
	stroke-width: 2;
	animation: 530ms infinite ${keyframes({ to: { stroke: "transparent" } })};
	pointer-events: none;
`;
