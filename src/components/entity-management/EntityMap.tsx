import React, { useEffect, useRef, useState } from "react";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import Card from "@common/card/Card";

import { formatCoordinate } from "@utils/entity-management";

import { EntityStatus, GeoEntity } from "../../domain/geospatial-entity";

interface EntityMapProps {
	entities: GeoEntity[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	onMapClick?: (latitude: number, longitude: number) => void;
}

const statusColorHex: Record<EntityStatus, string> = {
	Active: "#4F9669",
	Idle: "#D7C525",
	Maintenance: "#3575F3",
	Offline: "#C13B3B"
};

/**
 * Creates custom HTML string for entity marker with status coloring and pulse effect on selection.
 *
 * @param {GeoEntity} entity - Entity to render.
 * @param {boolean} isSelected - Whether entity is selected.
 * @returns {string} HTML string for divIcon.
 */
const createMarkerHtml = (entity: GeoEntity, isSelected: boolean): string => {
	const color = statusColorHex[entity.status] || "#4F9669";
	const pulseRing = isSelected
		? `<div class="absolute -inset-2 rounded-full animate-ping opacity-75" style="background-color: ${color};"></div>`
		: "";
	const glow = isSelected
		? `<div class="absolute -inset-1.5 rounded-full blur-sm" style="background-color: ${color}; opacity: 0.8;"></div>`
		: "";

	return `
		<div class="relative flex items-center justify-center cursor-pointer select-none group" style="width: 28px; height: 28px;">
			${pulseRing}
			${glow}
			<div class="relative flex items-center justify-center w-6 h-6 rounded-full border-2 border-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.6)] transition-transform duration-200 ${
				isSelected ? "scale-125 ring-2 ring-white" : "group-hover:scale-110"
			}" style="background-color: ${color};">
				<span class="w-2 h-2 rounded-full bg-white shadow-sm"></span>
			</div>
		</div>
	`;
};

/**
 * Creates HTML string for the temporary clicked coordinate pin.
 *
 * @returns {string} HTML string for temporary pin.
 */
const createPickedPinHtml = (): string => `
	<div class="relative flex items-center justify-center cursor-pointer" style="width: 32px; height: 32px;">
		<div class="absolute -inset-2 rounded-full animate-ping opacity-90 bg-emerald-400"></div>
		<div class="relative flex items-center justify-center w-7 h-7 rounded-full border-2 border-white bg-emerald-500 shadow-xl">
			<span class="text-white text-xs font-bold">+</span>
		</div>
	</div>
`;

/**
 * Interactive Leaflet geospatial map displaying live entity markers, camera animations, and coordinate picking.
 *
 * @param {EntityMapProps} props - Component props.
 * @returns {React.ReactElement} The rendered Leaflet map.
 */
const EntityMap: React.FC<EntityMapProps> = ({
	entities,
	selectedId,
	onSelect,
	onMapClick
}) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const mapInstanceRef = useRef<L.Map | null>(null);
	const markersLayerRef = useRef<L.LayerGroup | null>(null);
	const pickedPinMarkerRef = useRef<L.Marker | null>(null);

	const onMapClickRef = useRef(onMapClick);
	const onSelectRef = useRef(onSelect);

	useEffect(() => {
		onMapClickRef.current = onMapClick;
	}, [onMapClick]);

	useEffect(() => {
		onSelectRef.current = onSelect;
	}, [onSelect]);

	const [clickedCoord, setClickedCoord] = useState<{
		lat: number;
		lng: number;
	} | null>(null);

	// Initialize Leaflet Map Instance ONCE on mount
	useEffect(() => {
		if (!mapContainerRef.current || mapInstanceRef.current) return;

		// Default center around Indonesia / South East Asia
		const defaultCenter: L.LatLngExpression = [-2.5, 118.0];
		const map = L.map(mapContainerRef.current, {
			center: defaultCenter,
			zoom: 5,
			zoomControl: true,
			attributionControl: true
		});

		// OpenStreetMap free tile layer with dark theme styling
		L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 19,
			className: "map-tiles-dark"
		}).addTo(map);

		const markersLayer = L.layerGroup().addTo(map);
		markersLayerRef.current = markersLayer;

		// Map click event for picking coordinates
		map.on("click", (e: L.LeafletMouseEvent) => {
			const { lat, lng } = e.latlng;
			setClickedCoord({ lat, lng });

			// Show temporary picked pin on map
			if (pickedPinMarkerRef.current) {
				pickedPinMarkerRef.current.setLatLng([lat, lng]);
			} else {
				const pickedIcon = L.divIcon({
					html: createPickedPinHtml(),
					className: "picked-pin-icon",
					iconSize: [32, 32],
					iconAnchor: [16, 16]
				});
				pickedPinMarkerRef.current = L.marker([lat, lng], {
					icon: pickedIcon,
					zIndexOffset: 1000
				}).addTo(map);
			}

			if (onMapClickRef.current) {
				onMapClickRef.current(lat, lng);
			}
		});

		mapInstanceRef.current = map;

		return () => {
			map.remove();
			mapInstanceRef.current = null;
		};
	}, []);

	// Clear temporary picked pin when an entity is selected or created
	useEffect(() => {
		if (selectedId && pickedPinMarkerRef.current) {
			pickedPinMarkerRef.current.remove();
			pickedPinMarkerRef.current = null;
			setClickedCoord(null);
		}
	}, [selectedId, entities]);

	// Render Entity Markers
	useEffect(() => {
		const markersLayer = markersLayerRef.current;
		if (!markersLayer || !mapInstanceRef.current) return;

		markersLayer.clearLayers();

		entities.forEach((entity) => {
			const isSelected = selectedId === entity.id;
			const icon = L.divIcon({
				html: createMarkerHtml(entity, isSelected),
				className: "entity-custom-marker",
				iconSize: [28, 28],
				iconAnchor: [14, 14]
			});

			const marker = L.marker([entity.latitude, entity.longitude], {
				icon,
				zIndexOffset: isSelected ? 500 : 10
			}).addTo(markersLayer);

			marker.bindTooltip(
				`<strong>${entity.name}</strong><br/><span style="color: ${statusColorHex[entity.status] || "#fff"};">${entity.status}</span> &bull; <span style="opacity: 0.8;">${entity.kind}</span>`,
				{
					direction: "top",
					offset: [0, -12],
					opacity: 0.95
				}
			);

			marker.on("click", (e) => {
				L.DomEvent.stopPropagation(e);
				onSelectRef.current(entity.id);
			});
		});
	}, [entities, selectedId]);

	// Camera handling:
	// - If selectedId is set: Fly to the selected entity with balanced zoom level (10)
	// - If selectedId is not set (e.g. filter/search changed or initial load): Fit bounds to show all entities
	useEffect(() => {
		const map = mapInstanceRef.current;
		if (!map) return;

		if (selectedId) {
			const selectedEntity = entities.find((e) => e.id === selectedId);
			if (selectedEntity) {
				map.flyTo([selectedEntity.latitude, selectedEntity.longitude], 10, {
					duration: 1.0,
					easeLinearity: 0.25
				});
				return;
			}
		}

		// When no entity is specifically selected (e.g. after filter change), auto-fit all visible entities
		if (entities.length > 0) {
			if (entities.length === 1) {
				map.flyTo([entities[0].latitude, entities[0].longitude], 10, {
					duration: 0.8
				});
			} else {
				const bounds = L.latLngBounds(
					entities.map((e) => [e.latitude, e.longitude] as [number, number])
				);
				if (bounds.isValid()) {
					map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
				}
			}
		}
	}, [selectedId, entities]);

	/**
	 * Reset camera view to fit all current entities.
	 */
	const handleResetView = () => {
		const map = mapInstanceRef.current;
		if (!map || entities.length === 0) return;

		if (entities.length === 1) {
			map.flyTo([entities[0].latitude, entities[0].longitude], 10, {
				duration: 0.8
			});
			return;
		}

		const bounds = L.latLngBounds(
			entities.map((e) => [e.latitude, e.longitude] as [number, number])
		);
		if (bounds.isValid()) {
			map.fitBounds(bounds, { padding: [50, 50], maxZoom: 11 });
		}
	};

	return (
		<Card className="relative overflow-hidden isolate border border-white/5 bg-background-100-1/90 p-0 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
			{/* Header Bar */}
			<div className="flex items-center justify-between border-b border-white/10 px-4 py-3.5 sm:px-5">
				<div>
					<p className="text-sm font-semibold text-white">Entity Map</p>
					<p className="text-xs text-white/50">
						Interactive map view with live telemetry markers.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<button
						type="button"
						onClick={handleResetView}
						className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white transition"
					>
						Fit All
					</button>
					<span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
						{entities.length} entities
					</span>
				</div>
			</div>

			{/* Map Container */}
			<div className="relative w-full h-[32rem] sm:h-[36rem]">
				<div ref={mapContainerRef} className="w-full h-full" />

				{/* Floating Bottom Hint / Pick Coordinates Overlay */}
				<div className="absolute bottom-3 left-3 right-3 z-[20] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/75 px-4 py-2.5 backdrop-blur-md text-xs text-white/80 pointer-events-none">
					<div className="flex items-center gap-2">
						<span className="text-sm">📍</span>
						<span>
							Click anywhere on the map to pick coordinates and create a new
							entity.
						</span>
					</div>
					{clickedCoord && (
						<span className="font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
							Picked: {formatCoordinate(clickedCoord.lat)},{" "}
							{formatCoordinate(clickedCoord.lng)}
						</span>
					)}
				</div>
			</div>
		</Card>
	);
};

export default React.memo(EntityMap);
