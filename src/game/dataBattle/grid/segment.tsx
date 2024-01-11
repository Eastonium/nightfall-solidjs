import { shade } from "polished";
import { JSX, mergeProps, splitProps } from "solid-js";

import { Position } from "./position";
import { keyframes, styled } from "solid-styled-components";

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

/**
 * A component that is meant to wrap around all the segments in the grid to make 'em flash
 */
interface SegmentWrapperProps extends JSX.SvgSVGAttributes<SVGGElement> {
	flashPositions: Position[] | false | undefined;
}
export const SegmentWrapper = styled((props: SegmentWrapperProps) => {
	const [p, gProps] = splitProps(props, ["children", "flashPositions"]);

	return (
		<g {...gProps}>
			<clipPath id={`segment-clipPath-${"square"}`}>
				<rect
					x={shapeOffset}
					y={shapeOffset}
					width={shapeSize}
					height={shapeSize}
				/>
			</clipPath>
			{p.children}
		</g>
	);
})((p) =>
	p.flashPositions
		? `
	${p.flashPositions
		.map((pos) => `& [data-pos="${pos.sectorIndex}"]`)
		.join(", ")} {
		animation: 100ms infinite steps(1) ${keyframes({ "50%": { opacity: 0 } })};
	}
`
		: ""
);
