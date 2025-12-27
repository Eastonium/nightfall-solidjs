import { createEffect, createSignal, For } from "solid-js";
import { styled } from "solid-styled-components";
import Hammer from "hammerjs";

import MapImage from "../../assets/packs/nightfall/textures/maps/map.png";
import { MapNode, MapNodeComponent } from "./mapNode";

interface PanState {
	x: number;
	y: number;
	scale: number;
}

export interface MapProps {
	nodes: MapNode[];
}

export const Map = (props: MapProps) => {
	let containerRef!: HTMLDivElement;
	let mapImageRef!: HTMLImageElement;

	const [panState, setPanState] = createSignal<PanState>({
		x: 0,
		y: 0,
		scale: 1,
	});

	// Initialize Hammer.js gesture recognizer
	createEffect(() => {
		if (!containerRef) return;

		const hammer = new Hammer(containerRef);

		// Configure pan gesture
		const pan = new Hammer.Pan({ threshold: 0, pointers: 0 });
		hammer.add(pan);

		// Configure pinch gesture for zoom
		const pinch = new Hammer.Pinch();
		hammer.add(pinch);

		let lastPanState: PanState | undefined;
		const minScale = 0.5;
		const maxScale = 1;

		// Get image dimensions
		const getImageDimensions = () => {
			if (mapImageRef && mapImageRef.complete) {
				return {
					width: mapImageRef.naturalWidth,
					height: mapImageRef.naturalHeight,
				};
			}
			return { width: 1024, height: 768 }; // fallback dimensions
		};

		// Clamp pan position within bounds
		const clampPanState = (newX: number, newY: number, scale: number) => {
			const { width, height } = getImageDimensions();
			const scaledWidth = width * scale;
			const scaledHeight = height * scale;
			const containerWidth = containerRef.clientWidth;
			const containerHeight = containerRef.clientHeight;

			// Calculate max pan values (allow image edges to reach container edges)
			const maxX = 0;
			const minX = -(scaledWidth - containerWidth);
			const maxY = 0;
			const minY = -(scaledHeight - containerHeight);

			return {
				x: Math.max(minX, Math.min(maxX, newX)),
				y: Math.max(minY, Math.min(maxY, newY)),
			};
		};

		// Handle pan and pinch
		hammer.on("panstart pinchstart", () => (lastPanState = panState()));
		hammer.on("pan", (e: HammerInput) => {
			const state = panState();
			const newPos = {
				x: lastPanState!.x + e.deltaX,
				y: lastPanState!.y + e.deltaY,
			};
			const clamped = clampPanState(newPos.x, newPos.y, state.scale);
			setPanState({
				...state,
				...clamped,
			});
		});
		hammer.on("pinch", (e: HammerInput) => {
			const state = panState();
			let newScale = lastPanState!.scale * e.scale;

			setPanState({
				...state,
				scale: Math.max(minScale, Math.min(maxScale, newScale)),
			});
		});

		// Handle mouse wheel for zoom (fallback for desktop)
		const wheelHandler = (e: WheelEvent) => {
			if (e.ctrlKey || e.metaKey) {
				e.preventDefault();
				const state = panState();
				const delta = e.deltaY > 0 ? 0.9 : 1.1;
				let newScale = state.scale * delta;

				newScale = Math.max(minScale, Math.min(maxScale, newScale));

				setPanState({
					...state,
					scale: newScale,
				});
			}
		};

		containerRef.addEventListener("wheel", wheelHandler, {
			passive: false,
		});

		return () => {
			hammer.destroy();
			containerRef.removeEventListener("wheel", wheelHandler);
		};
	});

	return (
		<MapContainer ref={containerRef}>
			<MapCanvas
				style={{
					transform: `translate(${panState().x}px, ${
						panState().y
					}px) scale(${panState().scale})`,
				}}
			>
				<MapImageStyled alt="map" src={MapImage} ref={mapImageRef} />

				<AccessPointLayer>
					<For each={props.nodes || []}>
						{(node) => <MapNodeComponent node={node} />}
					</For>
				</AccessPointLayer>
			</MapCanvas>
		</MapContainer>
	);
};

const MapContainer = styled("div")`
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
	background: #1a1a1a;
	touch-action: none;
`;

const MapCanvas = styled("div")`
	position: absolute;
	top: 0;
	left: 0;
	transform-origin: 0 0;
	cursor: grab;

	&:active {
		cursor: grabbing;
	}
`;

const MapImageStyled = styled("img")`
	display: block;
	user-select: none;
	pointer-events: none;
`;

const AccessPointLayer = styled("div")`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
`;
