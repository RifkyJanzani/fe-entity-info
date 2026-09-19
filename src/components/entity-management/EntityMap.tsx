import Badge from "@common/badge/Badge";
import Card from "@common/card/Card";

import {
	getStatusClassName,
	getStatusDotClassName,
	getStatusMarkerClassName,
	projectCoordinates
} from "@utils/entity-management";

import { GeoEntity } from "../../domain/geospatial-entity";

/**
 * Interactive map projection rendering pins for all active entities.
 *
 * @param {object} props - Component props.
 * @param {GeoEntity[]} props.entities - List of entities.
 * @param {string | null} props.selectedId - ID of the selected entity.
 * @param {Function} props.onSelect - Callback when an entity pin is clicked.
 * @returns {React.ReactElement} The rendered map.
 */
const EntityMap = ({
	entities,
	selectedId,
	onSelect
}: {
	entities: GeoEntity[];
	selectedId: string | null;
	onSelect: (id: string) => void;
}) => (
	<Card className="overflow-hidden border border-white/5 bg-background-100-1/90 p-0 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
		<div className="flex items-center justify-between border-b border-white/10 px-4 py-4 sm:px-5">
			<div>
				<p className="text-sm font-semibold text-white">Entity Map</p>
				<p className="text-sm text-white/50">
					Click any marker to inspect an entity.
				</p>
			</div>
			<div className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
				{entities.length} entities
			</div>
		</div>
		<div className="relative min-h-[28rem] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(79,150,105,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(53,117,243,0.14),transparent_32%),linear-gradient(180deg,#111614_0%,#0b0f0d_100%)] sm:min-h-[34rem]">
			<div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:48px_48px] opacity-25" />
			<div className="absolute inset-x-6 top-6 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/30">
				<span>North</span>
				<span>Global telemetry view</span>
			</div>
			<div className="absolute inset-x-6 bottom-6 flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-white/30">
				<span>West</span>
				<span>East</span>
			</div>
			<div className="absolute inset-0">
				{entities.map((entity) => {
					const position = projectCoordinates(
						entity.latitude,
						entity.longitude
					);
					const selected = selectedId === entity.id;
					return (
						<button
							key={entity.id}
							type="button"
							onClick={() => onSelect(entity.id)}
							className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
							style={{ left: `${position.left}%`, top: `${position.top}%` }}
						>
							<span
								className={`absolute inset-0 rounded-full blur-xl transition-opacity ${selected ? "opacity-100" : "opacity-0 group-hover:opacity-60"}`}
								style={{ backgroundColor: "rgba(79,150,105,0.45)" }}
							/>
							<Badge className="absolute -left-14 top-[-2.4rem] border-white/10 bg-white/5 opacity-0 text-white/70 transition-opacity group-hover:opacity-100">
								{entity.kind}
							</Badge>
							<span
								className={`relative flex h-5 w-5 items-center justify-center rounded-full border-2 shadow-[0_0_0_6px_rgba(0,0,0,0.15)] transition-transform duration-200 ${getStatusMarkerClassName(entity.status)} ${selected ? "scale-125" : "group-hover:scale-110"}`}
							>
								<span
									className={`h-2.5 w-2.5 rounded-full ${getStatusDotClassName(entity.status)}`}
								/>
							</span>
							<Badge
								uppercase={false}
								toneClassName={getStatusClassName(entity.status)}
								className={`absolute left-1/2 top-7 -translate-x-1/2 whitespace-nowrap tracking-[0.16em] transition-opacity ${selected ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}
							>
								{entity.name}
							</Badge>
						</button>
					);
				})}
			</div>
		</div>
	</Card>
);

export default EntityMap;
