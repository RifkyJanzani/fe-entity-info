import axios, { AxiosInstance } from "axios";

import {
	ApiSuccessResponse,
	CreateEntityPayload,
	EntityMetrics,
	EntityQueryParams,
	GeoEntity,
	UpdateEntityPayload
} from "../domain/geospatial-entity";

declare const process: {
	env?: Record<string, string | undefined>;
};

const API_BASE_URL =
	(typeof process !== "undefined" && process.env?.VITE_API_BASE_URL) ||
	"http://localhost:8080/api/v1";

export const apiClient: AxiosInstance = axios.create({
	baseURL: API_BASE_URL,
	headers: {
		"Content-Type": "application/json"
	},
	timeout: 10000
});

export const entityService = {
	/**
	 * Retrieves the list of entities, optionally filtered by kind, status, or search term.
	 *
	 * @param {EntityQueryParams} [params] - Optional query parameters.
	 * @returns {Promise<GeoEntity[]>} Array of geospatial entities.
	 */
	getEntities: async (params?: EntityQueryParams): Promise<GeoEntity[]> => {
		const cleanParams: Record<string, string> = {};
		if (params?.kind) cleanParams.kind = params.kind;
		if (params?.status) cleanParams.status = params.status;
		if (params?.search && params.search.trim())
			cleanParams.search = params.search.trim();

		const response = await apiClient.get<ApiSuccessResponse<GeoEntity[]>>(
			"/entities",
			{
				params: cleanParams
			}
		);
		return response.data.data ?? [];
	},

	/**
	 * Retrieves a single entity by its unique ID.
	 *
	 * @param {string} id - The entity ID.
	 * @returns {Promise<GeoEntity>} The geospatial entity.
	 */
	getEntityById: async (id: string): Promise<GeoEntity> => {
		const response = await apiClient.get<ApiSuccessResponse<GeoEntity>>(
			`/entities/${id}`
		);
		return response.data.data;
	},

	/**
	 * Creates a new geospatial entity.
	 *
	 * @param {CreateEntityPayload} payload - The creation payload.
	 * @returns {Promise<GeoEntity>} The created entity.
	 */
	createEntity: async (payload: CreateEntityPayload): Promise<GeoEntity> => {
		const response = await apiClient.post<ApiSuccessResponse<GeoEntity>>(
			"/entities",
			payload
		);
		return response.data.data;
	},

	/**
	 * Updates an existing geospatial entity.
	 *
	 * @param {string} id - The entity ID to update.
	 * @param {UpdateEntityPayload} payload - The update payload.
	 * @returns {Promise<GeoEntity>} The updated entity.
	 */
	updateEntity: async (
		id: string,
		payload: UpdateEntityPayload
	): Promise<GeoEntity> => {
		const response = await apiClient.put<ApiSuccessResponse<GeoEntity>>(
			`/entities/${id}`,
			payload
		);
		return response.data.data;
	},

	/**
	 * Deletes an entity by its ID.
	 *
	 * @param {string} id - The entity ID to delete.
	 * @returns {Promise<void>}
	 */
	deleteEntity: async (id: string): Promise<void> => {
		await apiClient.delete(`/entities/${id}`);
	},

	/**
	 * Retrieves aggregate metrics for all entities.
	 *
	 * @returns {Promise<EntityMetrics>} Aggregate entity metrics.
	 */
	getMetrics: async (): Promise<EntityMetrics> => {
		const response =
			await apiClient.get<ApiSuccessResponse<EntityMetrics>>(
				"/entities/metrics"
			);
		return response.data.data;
	}
};
