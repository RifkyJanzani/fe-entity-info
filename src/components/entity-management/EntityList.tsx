import React from "react";

import Badge from "@common/badge/Badge";
import Card from "@common/card/Card";
import CustomInput from "@common/custom-input/CustomInput";
import Dropdown from "@common/dropdown/Dropdown";

import {
	entityKindOptions,
	entityStatusOptions
} from "@constants/entity-management.constants";

import { formatCoordinate, getStatusClassName } from "@utils/entity-management";

import {
	EntityKind,
	EntityStatus,
	GeoEntity
} from "../../domain/geospatial-entity";

interface EntityListProps {
	entities: GeoEntity[];
	selectedId: string | null;
	onSelect: (id: string) => void;
	searchQuery?: string;
	onSearchChange?: (query: string) => void;
	filterKind?: EntityKind | "";
	onKindChange?: (kind: EntityKind | "") => void;
	filterStatus?: EntityStatus | "";
	onStatusChange?: (status: EntityStatus | "") => void;
	isLoading?: boolean;
}

const allKindOptions = [
	{ label: "All Types", value: "" },
	...entityKindOptions
];
const allStatusOptions = [
	{ label: "All Statuses", value: "" },
	...entityStatusOptions
];

/**
 * Roster list of entities with search input, status/kind filters, and map synchronization.
 *
 * @param {EntityListProps} props - Component props.
 * @returns {React.ReactElement} The rendered roster list.
 */
const EntityList: React.FC<EntityListProps> = ({
	entities,
	selectedId,
	onSelect,
	searchQuery = "",
	onSearchChange,
	filterKind = "",
	onKindChange,
	filterStatus = "",
	onStatusChange,
	isLoading = false
}) => {
	return (
		<Card className="border border-white/5 bg-background-100-1/90 p-0 shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
			<div className="flex flex-col gap-3 border-b border-white/10 px-4 py-4 sm:px-5">
				<div className="flex items-center justify-between">
					<div>
						<p className="text-sm font-semibold text-white">Entity roster</p>
						<p className="text-sm text-white/50">
							Select any item to focus the map.
						</p>
					</div>
					<div className="flex items-center gap-2">
						{isLoading && (
							<span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
						)}
						<span className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/60">
							{entities.length} total
						</span>
					</div>
				</div>

				{(onSearchChange || onKindChange || onStatusChange) && (
					<div className="grid gap-2 pt-1 sm:grid-cols-3">
						{onSearchChange && (
							<div className="sm:col-span-1">
								<CustomInput
									name="search"
									value={searchQuery}
									placeholder="Search entity..."
									onChange={(val) => onSearchChange(val)}
								/>
							</div>
						)}
						{onKindChange && (
							<div>
								<Dropdown
									options={allKindOptions}
									value={filterKind}
									onChange={(val) => onKindChange(val as EntityKind | "")}
									placeholder="Filter by type"
								/>
							</div>
						)}
						{onStatusChange && (
							<div>
								<Dropdown
									options={allStatusOptions}
									value={filterStatus}
									onChange={(val) => onStatusChange(val as EntityStatus | "")}
									placeholder="Filter by status"
								/>
							</div>
						)}
					</div>
				)}
			</div>

			<div className="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-1">
				{isLoading && entities.length === 0 ? (
					<div className="py-8 text-center text-sm text-white/50">
						Loading entities from backend...
					</div>
				) : entities.length === 0 ? (
					<div className="py-8 text-center text-sm text-white/50">
						No entities found matching the current filter.
					</div>
				) : (
					entities.map((entity) => {
						const selected = selectedId === entity.id;
						return (
							<button
								key={entity.id}
								type="button"
								onClick={() => onSelect(entity.id)}
								className={`rounded-xl border p-4 text-left transition duration-200 ${
									selected
										? "border-[#4F9669] bg-[#111d17] shadow-[0_0_0_1px_rgba(79,150,105,0.3)]"
										: "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
								}`}
							>
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="font-semibold text-white">{entity.name}</p>
										<Badge className="border-white/10 bg-white/5 text-white/70">
											{entity.kind}
										</Badge>
									</div>
									<Badge toneClassName={getStatusClassName(entity.status)}>
										{entity.status}
									</Badge>
								</div>
								<div className="mt-3 flex items-center justify-between text-sm text-white/70">
									<span>
										{formatCoordinate(entity.latitude)} /{" "}
										{formatCoordinate(entity.longitude)}
									</span>
									<span>{entity.updatedAt}</span>
								</div>
							</button>
						);
					})
				)}
			</div>
		</Card>
	);
};

export default EntityList;
