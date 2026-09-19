export const ENTITY_DOMAIN = "geospatial-entity" as const;

export type EntityKind = "Vehicle" | "IoT Device" | "Facility" | "Asset";
export type EntityStatus = "Active" | "Idle" | "Maintenance" | "Offline";

export type EntityAttribute = {
	label: string;
	value: string;
};

export type GeoEntity = {
	id: string;
	name: string;
	kind: EntityKind;
	status: EntityStatus;
	latitude: number;
	longitude: number;
	description: string;
	attributes: EntityAttribute[];
	createdAt?: string;
	updatedAt: string;
};

export type EntityFormState = {
	id?: string;
	name: string;
	kind: EntityKind;
	status: EntityStatus;
	latitude: string;
	longitude: string;
	description: string;
	attributesText: string;
};

export type FormErrors = Partial<
	Record<
		| "name"
		| "latitude"
		| "longitude"
		| "kind"
		| "status"
		| "description"
		| "attributes",
		string
	>
>;

export type ModalMode = "add" | "edit" | null;

export interface CreateEntityPayload {
	name: string;
	kind: EntityKind;
	status: EntityStatus;
	latitude: number;
	longitude: number;
	description?: string;
	attributes?: EntityAttribute[];
}

export interface UpdateEntityPayload {
	name?: string;
	kind?: EntityKind;
	status?: EntityStatus;
	latitude?: number;
	longitude?: number;
	description?: string;
	attributes?: EntityAttribute[];
}

export interface EntityQueryParams {
	kind?: EntityKind;
	status?: EntityStatus;
	search?: string;
}

export interface EntityMetrics {
	totalCount: number;
	activeCount: number;
	offlineCount: number;
	facilityCount: number;
}

export interface ValidationErrorDetail {
	field: string;
	message: string;
}

export interface ApiSuccessResponse<T> {
	success: true;
	message?: string;
	data: T;
}

export interface ApiErrorResponse {
	success: false;
	error: {
		code: string;
		message: string;
		details?: Record<string, string> | ValidationErrorDetail[] | string;
	};
}
