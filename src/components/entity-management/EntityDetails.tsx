import Badge from "@common/badge/Badge";
import { Button } from "@common/button/Button";
import Card from "@common/card/Card";

import { formatCoordinate, getStatusClassName } from "@utils/entity-management";

import { GeoEntity } from "../../domain/geospatial-entity";

/**
 * Detail inspection panel for a selected entity.
 *
 * @param {object} props - Component props.
 * @param {GeoEntity | null} props.entity - The currently selected entity.
 * @param {Function} props.onEdit - Callback to edit entity.
 * @param {Function} props.onDelete - Callback to delete entity.
 * @param {Function} props.onAdd - Callback to open add entity modal.
 * @returns {React.ReactElement} The rendered detail card.
 */
const EntityDetails = ({
	entity,
	onEdit,
	onDelete,
	onAdd
}: {
	entity: GeoEntity | null;
	onEdit: (entity: GeoEntity) => void;
	onDelete: (entityId: string) => void;
	onAdd: () => void;
}) => {
	if (!entity) {
		return (
			<Card className="flex h-full min-h-[20rem] flex-col justify-between border border-white/5 bg-background-100-1/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
				<div>
					<p className="text-sm font-semibold text-white">Entity detail</p>
					<p className="mt-1 text-sm text-white/50">
						No entity is selected yet.
					</p>
				</div>
				<div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-5 text-center text-sm text-white/50">
					Click a marker on the map or select one from the roster to inspect its
					data.
				</div>
				<Button onClick={onAdd} color="success" fullWidth>
					Add entity
				</Button>
			</Card>
		);
	}

	return (
		<Card className="flex h-full flex-col border border-white/5 bg-background-100-1/90 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
			<div className="flex items-start justify-between gap-4">
				<div>
					<p className="text-sm font-semibold text-white">Entity detail</p>
					<h2 className="mt-2 text-2xl font-bold text-white">{entity.name}</h2>
					<Badge className="mt-2 border-white/10 bg-white/5 px-3 py-1 text-white/70">
						{entity.kind}
					</Badge>
					<p className="mt-2 text-sm text-white/50">{entity.id}</p>
				</div>
				<Badge
					toneClassName={getStatusClassName(entity.status)}
					className="px-3 py-1"
				>
					{entity.status}
				</Badge>
			</div>
			<div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
				<p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
					Updated
				</p>
				<p className="mt-1 text-sm font-semibold text-white">
					{entity.updatedAt}
				</p>
			</div>
			<div className="mt-3 grid gap-3 sm:grid-cols-2">
				<div className="rounded-xl border border-white/10 bg-white/5 p-4">
					<p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
						Latitude
					</p>
					<p className="mt-1 text-sm font-semibold text-white">
						{formatCoordinate(entity.latitude)}
					</p>
				</div>
				<div className="rounded-xl border border-white/10 bg-white/5 p-4">
					<p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
						Longitude
					</p>
					<p className="mt-1 text-sm font-semibold text-white">
						{formatCoordinate(entity.longitude)}
					</p>
				</div>
			</div>
			<div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
				<p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
					Description
				</p>
				<p className="mt-2 text-sm leading-6 text-white/75">
					{entity.description}
				</p>
			</div>
			<div className="mt-5 flex-1 rounded-xl border border-white/10 bg-white/5 p-4">
				<p className="text-[10px] uppercase tracking-[0.22em] text-white/45">
					Attributes
				</p>
				<div className="mt-3 grid gap-3">
					{entity.attributes.map((attribute) => (
						<div
							key={`${entity.id}-${attribute.label}`}
							className="flex items-start justify-between gap-4 rounded-lg border border-white/10 bg-black/20 px-3 py-2"
						>
							<span className="text-sm text-white/60">{attribute.label}</span>
							<span className="text-sm font-semibold text-white">
								{attribute.value}
							</span>
						</div>
					))}
				</div>
			</div>
			<div className="mt-5 grid gap-3 sm:grid-cols-2">
				<Button variant="outline" color="gray" onClick={() => onEdit(entity)}>
					Edit entity
				</Button>
				<Button
					variant="solid"
					color="error"
					onClick={() => onDelete(entity.id)}
				>
					Delete entity
				</Button>
			</div>
			<Button
				className="mt-3"
				variant="ghost"
				color="success"
				onClick={onAdd}
				fullWidth
			>
				Add another entity
			</Button>
		</Card>
	);
};

export default EntityDetails;
