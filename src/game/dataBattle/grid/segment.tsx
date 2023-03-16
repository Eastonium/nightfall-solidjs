import { shade } from "polished";

// import { DataBattleIdContext } from "game/dataBattle";
import { mergeProps, useContext } from "solid-js";
import { css, keyframes } from "solid-styled-components";

export const gridUnitSize = 32;
const depth = 3;
const shapeSize = 27;
const shapeOffset = Math.floor((gridUnitSize - shapeSize - depth) / 2);
const iconOffset = Math.floor(-depth / 2);
const connectorOffset = shapeSize / 2 + shapeOffset;
const connectorWidth = 7;

interface PositionProps {
	column: number;
	row: number;
}

interface SegmentProps extends PositionProps {
	icon: string | null;
	color: string;
	connectRight?: boolean;
	connectDown?: boolean;
}
export const Segment = (props: SegmentProps) => {
	const p = mergeProps({ connectRight: false, connectDown: false }, props);

	const shadeColor = shade(0.5, p.color);
	return (
		<g transform={`translate(${p.column * gridUnitSize} ${p.row * gridUnitSize})`}>
			{p.connectRight && (
				<path
					fill="none"
					stroke={shadeColor}
					stroke-width={connectorWidth}
					d={`M${connectorOffset},${connectorOffset + depth}h${gridUnitSize}`}
				/>
			)}
			{p.connectDown && (
				<path
					fill="none"
					stroke={shadeColor}
					stroke-width={connectorWidth}
					d={`M${connectorOffset + depth},${connectorOffset}v${gridUnitSize}`}
				/>
			)}
			<path
				d={`M${
					shapeOffset + shapeSize
				},${shapeOffset}l${depth},${depth}v${shapeSize}h${-shapeSize}l${-depth},${-depth}`}
				fill={shadeColor}
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
				<rect x={0} y={0} width={gridUnitSize} height={gridUnitSize} fill={p.color} />
				<image href={p.icon ?? undefined} x={iconOffset} y={iconOffset} />
			</g>
		</g>
	);
};

export const SegmentClipPath = () => {
	return (
		<clipPath id={`segment-clipPath-${"square"}`}>
			<rect x={shapeOffset} y={shapeOffset} width={shapeSize} height={shapeSize} />
		</clipPath>
	);
};

interface CellSelectionIndicatorProps extends PositionProps {}
export const CellSelectionIndicator = (p: CellSelectionIndicatorProps) => (
	<rect
		class={selectionIndicatorStyles}
		transform={`translate(${p.column * gridUnitSize} ${p.row * gridUnitSize})`}
		x={1}
		y={1}
		width={gridUnitSize - 2}
		height={gridUnitSize - 2}
	/>
);
const selectionIndicatorStyles = css`
	fill: none;
	stroke: #fff;
	stroke-width: 2;
	animation: 530ms infinite ${keyframes`to { stroke: transparent; }`};
`;

interface TileProps extends PositionProps {}
export const Tile = (p: TileProps) => (
	<rect
		transform={`translate(${p.column * gridUnitSize} ${p.row * gridUnitSize})`}
		x={2}
		y={2}
		width={gridUnitSize - 4}
		height={gridUnitSize - 4}
		fill="#0006"
	/>
);

