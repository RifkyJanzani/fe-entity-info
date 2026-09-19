import { useCallback, useEffect, useMemo, useState } from "react";

import axios from "axios";

import {
	blankFormState,
	extractValidationErrors,
	formatTimeAgo,
	parseAttributesText
} from "@utils/entity-management";

import {
	ApiErrorResponse,
	CreateEntityPayload,
	EntityFormState,
	EntityKind,
	EntityMetrics,
	EntityStatus,
	FormErrors,
	GeoEntity,
	ModalMode,
	UpdateEntityPayload
} from "../domain/geospatial-entity";
import { entityService } from "../services/entityService";

/**
 * Custom hook for managing the entity dashboard state, filters, modal forms, and backend synchronization.
 *
 * @returns Dashboard state and action handlers.
 */
export const useEntityDashboard = () => {
	const [entities, setEntities] = useState<GeoEntity[]>([]);
	const [selectedId, setSelectedId] = useState<string>("");
	const [modalMode, setModalMode] = useState<ModalMode>(null);
	const [draft, setDraft] = useState<EntityFormState>(blankFormState());
	const [errors, setErrors] = useState<FormErrors>({});
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isSaving, setIsSaving] = useState<boolean>(false);
	const [apiError, setApiError] = useState<string | null>(null);
	const [backendMetrics, setBackendMetrics] = useState<EntityMetrics | null>(
		null
	);

	const [searchQuery, setSearchQuery] = useState<string>("");
	const [filterKind, setFilterKind] = useState<EntityKind | "">("");
	const [filterStatus, setFilterStatus] = useState<EntityStatus | "">("");

	const selectedEntity = useMemo(
		() => entities.find((entity) => entity.id === selectedId) ?? null,
		[entities, selectedId]
	);

	const stats = useMemo(() => {
		if (backendMetrics && !searchQuery && !filterKind && !filterStatus) {
			return {
				totalCount: backendMetrics.totalCount,
				activeCount: backendMetrics.activeCount,
				offlineCount: backendMetrics.offlineCount,
				facilityCount: backendMetrics.facilityCount
			};
		}

		return entities.reduce(
			(accumulator, entity) => {
				accumulator.totalCount += 1;
				if (entity.status === "Active") accumulator.activeCount += 1;
				if (entity.status === "Offline") accumulator.offlineCount += 1;
				if (entity.kind === "Facility") accumulator.facilityCount += 1;
				return accumulator;
			},
			{ totalCount: 0, activeCount: 0, offlineCount: 0, facilityCount: 0 }
		);
	}, [entities, backendMetrics, searchQuery, filterKind, filterStatus]);

	const loadEntities = useCallback(async () => {
		setIsLoading(true);
		setApiError(null);
		try {
			const params: {
				kind?: EntityKind;
				status?: EntityStatus;
				search?: string;
			} = {};
			if (filterKind) params.kind = filterKind;
			if (filterStatus) params.status = filterStatus;
			if (searchQuery.trim()) params.search = searchQuery.trim();

			const [entitiesData, metricsData] = await Promise.allSettled([
				entityService.getEntities(params),
				entityService.getMetrics()
			]);

			if (entitiesData.status === "fulfilled") {
				const formattedEntities = entitiesData.value.map((ent) => ({
					...ent,
					updatedAt: formatTimeAgo(ent.updatedAt)
				}));
				setEntities(formattedEntities);

				if (filterKind || filterStatus || searchQuery.trim()) {
					// When filter or search is active, don't force select a single entity so the map fits all filtered items
					setSelectedId((current) => {
						const exists = formattedEntities.some((e) => e.id === current);
						return exists ? current : "";
					});
				} else if (formattedEntities.length > 0) {
					setSelectedId((current) => {
						const exists = formattedEntities.some((e) => e.id === current);
						return exists ? current : formattedEntities[0].id;
					});
				} else {
					setSelectedId("");
				}
			} else {
				throw entitiesData.reason;
			}

			if (metricsData.status === "fulfilled") {
				setBackendMetrics(metricsData.value);
			}
		} catch (err) {
			console.error("Failed to load entities from backend:", err);
			if (axios.isAxiosError<ApiErrorResponse>(err)) {
				const msg = err.response?.data?.error?.message || err.message;
				setApiError(`Backend API connection failed: ${msg}`);
			} else if (err instanceof Error) {
				setApiError(`Backend API error: ${err.message}`);
			} else {
				setApiError("Unable to connect to backend server.");
			}
		} finally {
			setIsLoading(false);
		}
	}, [filterKind, filterStatus, searchQuery]);

	useEffect(() => {
		void loadEntities();
	}, [loadEntities]);

	/**
	 * Opens the modal dialog with a given mode and optional seed entity.
	 *
	 * @param {Exclude<ModalMode, null>} nextMode - Modal mode.
	 * @param {GeoEntity} [seed] - Optional seed entity.
	 */
	const openModal = useCallback(
		(nextMode: Exclude<ModalMode, null>, seed?: GeoEntity) => {
			setDraft(blankFormState(seed));
			setErrors({});
			setModalMode(nextMode);
		},
		[]
	);

	/**
	 * Opens the add entity modal.
	 */
	const openAddModal = useCallback(() => {
		openModal("add");
	}, [openModal]);

	/**
	 * Opens the edit entity modal.
	 *
	 * @param {GeoEntity} entity - Entity to edit.
	 */
	const openEditModal = useCallback(
		(entity: GeoEntity) => {
			openModal("edit", entity);
		},
		[openModal]
	);

	/**
	 * Closes the modal.
	 */
	const closeModal = useCallback(() => {
		setModalMode(null);
		setErrors({});
	}, []);

	/**
	 * Handles clicking on the map to pick coordinates for entity creation.
	 *
	 * @param {number} latitude - Picked latitude coordinate.
	 * @param {number} longitude - Picked longitude coordinate.
	 */
	const handleMapClick = useCallback((latitude: number, longitude: number) => {
		const formattedLat = latitude.toFixed(4);
		const formattedLng = longitude.toFixed(4);

		setDraft((current) => ({
			...current,
			latitude: formattedLat,
			longitude: formattedLng
		}));

		setModalMode((currentMode) => {
			if (currentMode === null) {
				setErrors({});
				return "add";
			}
			return currentMode;
		});
	}, []);

	/**
	 * Changes search query and deselects single entity to fit all results.
	 */
	const handleSearchChange = useCallback((query: string) => {
		setSearchQuery(query);
		setSelectedId("");
	}, []);

	/**
	 * Changes kind filter and deselects single entity to fit all results.
	 */
	const handleKindChange = useCallback((kind: EntityKind | "") => {
		setFilterKind(kind);
		setSelectedId("");
	}, []);

	/**
	 * Changes status filter and deselects single entity to fit all results.
	 */
	const handleStatusChange = useCallback((status: EntityStatus | "") => {
		setFilterStatus(status);
		setSelectedId("");
	}, []);

	/**
	 * Validates the draft form on client side.
	 *
	 * @returns {boolean} True if draft is valid.
	 */
	const validateDraft = useCallback(() => {
		const nextErrors: FormErrors = {};
		const latitude = Number(draft.latitude);
		const longitude = Number(draft.longitude);

		if (!draft.name.trim()) {
			nextErrors.name = "Name is required.";
		}

		if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
			nextErrors.latitude = "Latitude must be between -90 and 90.";
		}

		if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
			nextErrors.longitude = "Longitude must be between -180 and 180.";
		}

		setErrors(nextErrors);
		return Object.keys(nextErrors).length === 0;
	}, [draft]);

	/**
	 * Handles modal form submission (create or update).
	 */
	const handleSubmit = useCallback(async () => {
		if (!validateDraft()) {
			return;
		}

		setIsSaving(true);
		setApiError(null);

		const latitude = Number(draft.latitude);
		const longitude = Number(draft.longitude);
		const attributes = parseAttributesText(draft.attributesText);

		try {
			if (modalMode === "edit" && draft.id) {
				const payload: UpdateEntityPayload = {
					name: draft.name.trim(),
					kind: draft.kind,
					status: draft.status,
					latitude,
					longitude,
					description: draft.description.trim(),
					attributes
				};

				const updated = await entityService.updateEntity(draft.id, payload);
				const formatted = {
					...updated,
					updatedAt: formatTimeAgo(updated.updatedAt)
				};

				setEntities((current) =>
					current.map((entity) => (entity.id === draft.id ? formatted : entity))
				);
				setSelectedId(draft.id);
			} else {
				const payload: CreateEntityPayload = {
					name: draft.name.trim(),
					kind: draft.kind,
					status: draft.status,
					latitude,
					longitude,
					description: draft.description.trim(),
					attributes
				};

				const created = await entityService.createEntity(payload);
				const formatted = {
					...created,
					updatedAt: formatTimeAgo(created.updatedAt)
				};

				setEntities((current) => [formatted, ...current]);
				setSelectedId(created.id);
			}

			void entityService
				.getMetrics()
				.then(setBackendMetrics)
				.catch(() => {});
			closeModal();
		} catch (err) {
			console.error("Failed to submit entity to backend:", err);
			if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
				const errorData = err.response.data;
				if (errorData?.error?.details) {
					const fieldErrors = extractValidationErrors(errorData.error.details);
					setErrors(fieldErrors);
				} else if (errorData?.error?.message) {
					setApiError(errorData.error.message);
				} else {
					setApiError(`Server error (${err.response.status})`);
				}
			} else if (err instanceof Error) {
				setApiError(err.message);
			} else {
				setApiError("Failed to save entity.");
			}
		} finally {
			setIsSaving(false);
		}
	}, [draft, modalMode, validateDraft, closeModal]);

	/**
	 * Handles entity deletion.
	 *
	 * @param {string} entityId - ID of the entity to delete.
	 */
	const handleDelete = useCallback(
		async (entityId: string) => {
			setIsSaving(true);
			setApiError(null);
			try {
				await entityService.deleteEntity(entityId);
				setEntities((current) => {
					const next = current.filter((entity) => entity.id !== entityId);
					if (selectedId === entityId) {
						setSelectedId(next[0]?.id ?? "");
					}
					return next;
				});
				void entityService
					.getMetrics()
					.then(setBackendMetrics)
					.catch(() => {});
			} catch (err) {
				console.error("Failed to delete entity:", err);
				if (axios.isAxiosError<ApiErrorResponse>(err) && err.response) {
					const msg =
						err.response.data?.error?.message ||
						`Failed to delete entity (${err.response.status})`;
					setApiError(msg);
				} else if (err instanceof Error) {
					setApiError(err.message);
				} else {
					setApiError("Failed to delete entity.");
				}
			} finally {
				setIsSaving(false);
			}
		},
		[selectedId]
	);

	/**
	 * Resets all filters and reloads data from backend.
	 */
	const handleReset = useCallback(() => {
		setSearchQuery("");
		setFilterKind("");
		setFilterStatus("");
		setSelectedId("");
		void loadEntities();
	}, [loadEntities]);

	return {
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
		setSearchQuery: handleSearchChange,
		setFilterKind: handleKindChange,
		setFilterStatus: handleStatusChange,
		openAddModal,
		openEditModal,
		closeModal,
		handleMapClick,
		handleSubmit,
		handleDelete,
		handleReset,
		refresh: loadEntities
	};
};
