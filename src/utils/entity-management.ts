import {
	getAttributesTextForKind,
	getDefaultAttributesForKind
} from "@constants/entity-management.constants";

import {
	EntityAttribute,
	EntityFormState,
	EntityKind,
	EntityStatus,
	GeoEntity
} from "../domain/geospatial-entity";

/**
 * Clamps a numeric value between a minimum and maximum bound.
 *
 * @param {number} value - The input value.
 * @param {number} min - The minimum bound.
 * @param {number} max - The maximum bound.
 * @returns {number} The clamped value.
 */
export const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

/**
 * Formats a coordinate for display.
 *
 * @param {number} value - The numeric coordinate.
 * @returns {string} The formatted coordinate.
 */
export const formatCoordinate = (value: number) => value.toFixed(4);

/**
 * Projects latitude and longitude into normalized map coordinates.
 *
 * @param {number} latitude - The latitude value.
 * @param {number} longitude - The longitude value.
 * @returns {{ left: number; top: number }} The normalized map position.
 */
export const projectCoordinates = (latitude: number, longitude: number) => ({
	left: clamp(((longitude + 180) / 360) * 100, 5, 95),
	top: clamp(((90 - latitude) / 180) * 100, 8, 92)
});

/**
 * Builds the default form state for a given entity seed.
 *
 * @param {GeoEntity} [seed] - The optional entity used to seed the form.
 * @returns {EntityFormState} The initial form state.
 */
export const blankFormState = (seed?: GeoEntity): EntityFormState => ({
	id: seed?.id,
	name: seed?.name ?? "",
	kind: seed?.kind ?? "Facility",
	status: seed?.status ?? "Active",
	latitude: seed ? seed.latitude.toFixed(4) : "0.0000",
	longitude: seed ? seed.longitude.toFixed(4) : "0.0000",
	description: seed?.description ?? "",
	attributesText:
		seed?.attributes && seed.attributes.length > 0
			? seed.attributes
					.map((attribute) => `${attribute.label}: ${attribute.value}`)
					.join("\n")
			: getAttributesTextForKind(seed?.kind ?? "Facility")
});

/**
 * Parses multi-line text into a list of key-value entity attributes.
 *
 * @param {string} text - Multi-line string with "Key: Value" per line.
 * @returns {EntityAttribute[]} Array of parsed entity attributes.
 */
export const parseAttributesText = (text: string): EntityAttribute[] => {
	if (!text || !text.trim()) {
		return [];
	}

	return text
		.split("\n")
		.map((line) => line.trim())
		.filter((line) => line.length > 0)
		.map((line) => {
			const separatorIndex = line.indexOf(":");
			if (separatorIndex !== -1) {
				const label = line.slice(0, separatorIndex).trim();
				const value = line.slice(separatorIndex + 1).trim();
				return { label, value };
			}
			return { label: line, value: "" };
		})
		.filter((attribute) => attribute.label.length > 0);
};

/**
 * Generates a simple unique entity identifier.
 *
 * @returns {string} The generated identifier.
 */
export const createEntityId = () =>
	`ENT-${Date.now().toString(36).slice(-6).toUpperCase()}`;

/**
 * Returns the status badge classes for a status value.
 *
 * @param {EntityStatus} status - The entity status.
 * @returns {string} The Tailwind class string for the status badge.
 */
export const getStatusClassName = (status: EntityStatus) =>
	({
		Active: "bg-[#194B33] text-[#CFF4DE] border-[#3E8A63]",
		Idle: "bg-[#40381E] text-[#F0E3A2] border-[#8D7B2F]",
		Maintenance: "bg-[#1E3752] text-[#C8DBFF] border-[#4A6FA4]",
		Offline: "bg-[#4A1E1E] text-[#FFCFCF] border-[#8B3B3B]"
	})[status];

const statusMarkerClasses: Record<EntityStatus, string> = {
	Active: "border-[#4F9669] bg-[#0F271A]",
	Idle: "border-[#D7C525] bg-[#2E280A]",
	Maintenance: "border-[#3575F3] bg-[#0D172A]",
	Offline: "border-[#C13B3B] bg-[#2B1010]"
};

const statusDotClasses: Record<EntityStatus, string> = {
	Active: "bg-[#4F9669]",
	Idle: "bg-[#D7C525]",
	Maintenance: "bg-[#3575F3]",
	Offline: "bg-[#C13B3B]"
};

const kindToneClasses: Record<EntityKind, string> = {
	Vehicle: "bg-[#123625] text-[#D8F4E4] border-[#4F9669]",
	"IoT Device": "bg-[#12293D] text-[#D7ECFF] border-[#3575F3]",
	Facility: "bg-[#3F3416] text-[#FFF1BE] border-[#D7C525]",
	Asset: "bg-[#311B3F] text-[#F2D8FF] border-[#B86BE0]"
};

const kindMarkerClasses: Record<EntityKind, string> = {
	Vehicle: "border-[#4F9669] bg-[#0F271A]",
	"IoT Device": "border-[#3575F3] bg-[#0D172A]",
	Facility: "border-[#D7C525] bg-[#2E280A]",
	Asset: "border-[#B86BE0] bg-[#24102E]"
};

const kindDotClasses: Record<EntityKind, string> = {
	Vehicle: "bg-[#4F9669]",
	"IoT Device": "bg-[#3575F3]",
	Facility: "bg-[#D7C525]",
	Asset: "bg-[#B86BE0]"
};

const kindGlowColors: Record<EntityKind, string> = {
	Vehicle: "rgba(79,150,105,0.45)",
	"IoT Device": "rgba(53,117,243,0.35)",
	Facility: "rgba(215,197,37,0.28)",
	Asset: "rgba(184,107,224,0.3)"
};

/**
 * Returns the category badge classes for a kind.
 *
 * @param {EntityKind} kind - The entity category.
 * @returns {string} The Tailwind class string for the category badge.
 */
export const getKindClassName = (kind: EntityKind) => kindToneClasses[kind];

/**
 * Returns the marker shell classes for a kind.
 *
 * @param {EntityKind} kind - The entity category.
 * @returns {string} The Tailwind class string for the marker shell.
 */
export const getKindMarkerClassName = (kind: EntityKind) =>
	kindMarkerClasses[kind];

/**
 * Returns the inner dot classes for a kind.
 *
 * @param {EntityKind} kind - The entity category.
 * @returns {string} The Tailwind class string for the inner dot.
 */
export const getKindDotClassName = (kind: EntityKind) => kindDotClasses[kind];

/**
 * Returns the glow color used behind a map marker.
 *
 * @param {EntityKind} kind - The entity category.
 * @returns {string} The CSS color used for the marker glow.
 */
export const getKindGlowColor = (kind: EntityKind) => kindGlowColors[kind];

/**
 * Returns the marker shell classes for a status.
 *
 * @param {EntityStatus} status - The entity status.
 * @returns {string} The Tailwind class string for the marker shell.
 */
export const getStatusMarkerClassName = (status: EntityStatus) =>
	statusMarkerClasses[status];

/**
 * Returns the inner dot classes for a status.
 *
 * @param {EntityStatus} status - The entity status.
 * @returns {string} The Tailwind class string for the inner dot.
 */
export const getStatusDotClassName = (status: EntityStatus) =>
	statusDotClasses[status];

/**
 * Returns the default attributes for a category.
 *
 * @param {EntityKind} kind - The entity category.
 * @returns {EntityAttribute[]} The cloned default attributes.
 */
export const getKindAttributes = (kind: EntityKind): EntityAttribute[] =>
	getDefaultAttributesForKind(kind);

/**
 * Formats an ISO date string or timestamp into a friendly relative time string.
 *
 * @param {string} [dateStr] - The ISO date string or existing label.
 * @returns {string} The formatted relative time string.
 */
export const formatTimeAgo = (dateStr?: string): string => {
	if (!dateStr) return "Just now";
	if (
		dateStr.startsWith("Updated") ||
		dateStr.startsWith("Created") ||
		dateStr === "Just now"
	) {
		return dateStr;
	}

	const date = new Date(dateStr);
	if (Number.isNaN(date.getTime())) {
		return dateStr;
	}

	const now = new Date();
	const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

	if (diffInSeconds < 60) {
		return "Just now";
	}
	const diffInMinutes = Math.floor(diffInSeconds / 60);
	if (diffInMinutes < 60) {
		return `${diffInMinutes} min ago`;
	}
	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) {
		return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
	}
	const diffInDays = Math.floor(diffInHours / 24);
	if (diffInDays < 7) {
		return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
	}

	return date.toLocaleDateString();
};

/**
 * Normalizes backend validation error details into a FormErrors object.
 *
 * @param {unknown} details - The error details from backend response.
 * @returns {Record<string, string>} The mapped form errors.
 */
export const extractValidationErrors = (
	details: unknown
): Record<string, string> => {
	const errors: Record<string, string> = {};
	if (!details) return errors;

	if (typeof details === "object" && !Array.isArray(details)) {
		for (const [key, value] of Object.entries(
			details as Record<string, unknown>
		)) {
			if (typeof value === "string") {
				const normalizedKey = key.toLowerCase();
				errors[normalizedKey] = value;
			}
		}
	} else if (Array.isArray(details)) {
		for (const item of details as unknown[]) {
			if (
				item &&
				typeof item === "object" &&
				"field" in item &&
				"message" in item
			) {
				const itemObj = item as { field: unknown; message: unknown };
				const field = String(itemObj.field).toLowerCase();
				errors[field] = String(itemObj.message);
			}
		}
	} else if (typeof details === "string") {
		errors.name = details;
	}

	return errors;
};
