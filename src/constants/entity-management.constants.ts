import { type SelectOption } from "@common/dropdown/Dropdown";

import {
	EntityAttribute,
	EntityKind,
	GeoEntity
} from "../domain/geospatial-entity";

export const entityKindOptions: SelectOption[] = [
	{ label: "Vehicle", value: "Vehicle" },
	{ label: "IoT Device", value: "IoT Device" },
	{ label: "Facility", value: "Facility" },
	{ label: "Asset", value: "Asset" }
];

export const entityStatusOptions: SelectOption[] = [
	{ label: "Active", value: "Active" },
	{ label: "Idle", value: "Idle" },
	{ label: "Maintenance", value: "Maintenance" },
	{ label: "Offline", value: "Offline" }
];

export const entityAttributeTemplates: Record<EntityKind, EntityAttribute[]> = {
	Vehicle: [
		{ label: "Owner", value: "Logistics Ops" },
		{ label: "Speed", value: "42 km/h" },
		{ label: "Signal", value: "Stable" }
	],
	"IoT Device": [
		{ label: "Zone", value: "Cold Storage A" },
		{ label: "Battery", value: "81%" },
		{ label: "Telemetry", value: "Every 15s" }
	],
	Facility: [
		{ label: "Manager", value: "Ops Center" },
		{ label: "Floor", value: "12" },
		{ label: "Access", value: "Restricted" }
	],
	Asset: [
		{ label: "Condition", value: "Sealed" },
		{ label: "Contents", value: "Spare Parts" },
		{ label: "Tracking", value: "GPS" }
	]
};

/**
 * Returns a cloned default attribute list for the given category.
 *
 * @param {EntityKind} kind - The entity category.
 * @returns {EntityAttribute[]} The cloned default attribute list.
 */
export const getDefaultAttributesForKind = (
	kind: EntityKind
): EntityAttribute[] =>
	entityAttributeTemplates[kind].map((attribute) => ({ ...attribute }));

/**
 * Serializes the default attributes for a category into textarea content.
 *
 * @param {EntityKind} kind - The entity category.
 * @returns {string} The formatted multi-line attributes text.
 */
export const getAttributesTextForKind = (kind: EntityKind) =>
	getDefaultAttributesForKind(kind)
		.map((attribute) => `${attribute.label}: ${attribute.value}`)
		.join("\n");

export const initialEntities: GeoEntity[] = [];
