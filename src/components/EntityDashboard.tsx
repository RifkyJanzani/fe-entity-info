import React from "react";

import { useEntityDashboard } from "@hooks/useEntityDashboard";

import { Button } from "@common/button/Button";

import { ENTITY_DOMAIN } from "../domain/geospatial-entity";
import EntityDetails from "./entity-management/EntityDetails";
import EntityFormModal from "./entity-management/EntityFormModal";
import EntityList from "./entity-management/EntityList";
import EntityMap from "./entity-management/EntityMap";
import EntityMetricCard from "./entity-management/EntityMetricCard";

/**
 * Main dashboard component displaying entity statistics, geospatial map, roster, and management forms.
 *
 * @returns {React.ReactElement} The rendered dashboard.
 */
const EntityDashboard: React.FC = () => {
	const {
		entities,
		selectedId,
		selectedEntity,
		stats,
		modalMode,
		draft,
		errors,
		isLoading,
		isSaving,
		apiError,
		searchQuery,
		filterKind,
		filterStatus,
		setDraft,
		setSelectedId,
		setSearchQuery,
		setFilterKind,
		setFilterStatus,
		openAddModal,
		openEditModal,
		closeModal,
		handleMapClick,
		handleSubmit,
		handleDelete,
		handleReset,
		refresh
	} = useEntityDashboard();

	const metrics = [
		{
			label: "Total entities",
			value: `${stats.totalCount}`,
			description: "All tracked objects in the current workspace"
		},
		{
			label: "Active",
			value: `${stats.activeCount}`,
			description: "Entities currently reporting normal operation"
		},
		{
			label: "Offline",
			value: `${stats.offlineCount}`,
			description: "Entities without live telemetry"
		},
		{
			label: "Facilities",
			value: `${stats.facilityCount}`,
			description: "Physical sites and fixed locations"
		}
	];

	return (
		<div
			className="min-h-screen w-full text-white"
			data-entity-domain={ENTITY_DOMAIN}
		>
			<div className="mx-auto flex w-full flex-col gap-4 px-3 py-3 sm:px-4 lg:px-6 lg:py-5">
				{/* Top Header */}
				<header className="rounded-3xl border border-white/5 bg-[linear-gradient(135deg,rgba(18,23,20,0.98),rgba(10,15,12,0.98))] px-5 py-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] sm:px-6">
					<div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
						<div className="max-w-3xl">
							<h1 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
								Entity Track Info
							</h1>
						</div>
						<div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
							<Button variant="solid" color="success" onClick={openAddModal}>
								Add entity
							</Button>
							<Button variant="outline" color="gray" onClick={handleReset}>
								{isLoading ? "Refreshing..." : "Reset Filters"}
							</Button>
						</div>
					</div>
				</header>

				{/* Error Notice Banner */}
				{apiError && (
					<div className="flex items-center justify-between rounded-2xl border border-amber-500/30 bg-amber-950/40 px-5 py-3.5 text-sm text-amber-200 backdrop-blur-sm">
						<div className="flex items-center gap-3">
							<span className="text-lg">⚠️</span>
							<span>{apiError}</span>
						</div>
						<Button
							variant="outline"
							color="gray"
							size="sm"
							onClick={() => {
								void refresh();
							}}
						>
							Retry Connection
						</Button>
					</div>
				)}

				{/* Metric Summary Cards */}
				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					{metrics.map((metric) => (
						<EntityMetricCard
							key={metric.label}
							label={metric.label}
							value={metric.value}
							description={metric.description}
						/>
					))}
				</div>

				{/* Main Layout: Map + List on Left, Details on Right */}
				<main className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(360px,0.85fr)]">
					<div className="flex min-w-0 flex-col gap-4">
						<EntityMap
							entities={entities}
							selectedId={selectedId}
							onSelect={setSelectedId}
							onMapClick={handleMapClick}
						/>
						<EntityList
							entities={entities}
							selectedId={selectedId}
							onSelect={setSelectedId}
							searchQuery={searchQuery}
							onSearchChange={setSearchQuery}
							filterKind={filterKind}
							onKindChange={setFilterKind}
							filterStatus={filterStatus}
							onStatusChange={setFilterStatus}
							isLoading={isLoading}
						/>
					</div>
					<div className="xl:sticky xl:top-5 xl:self-start">
						<EntityDetails
							entity={selectedEntity}
							onEdit={openEditModal}
							onDelete={(id) => {
								void handleDelete(id);
							}}
							onAdd={openAddModal}
						/>
					</div>
				</main>
			</div>

			{/* Form Modal for Add & Edit */}
			<EntityFormModal
				isOpen={modalMode !== null}
				mode={modalMode}
				draft={draft}
				errors={errors}
				isSaving={isSaving}
				onClose={closeModal}
				onChange={setDraft}
				onSubmit={() => {
					void handleSubmit();
				}}
			/>
		</div>
	);
};

export default EntityDashboard;
