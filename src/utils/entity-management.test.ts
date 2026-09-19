import { GeoEntity } from "../domain/geospatial-entity";
import {
	blankFormState,
	clamp,
	extractValidationErrors,
	formatCoordinate,
	formatTimeAgo,
	parseAttributesText,
	projectCoordinates
} from "./entity-management";

describe("entity-management utils", () => {
	describe("clamp", () => {
		it("clamps values correctly", () => {
			expect(clamp(5, 0, 10)).toBe(5);
			expect(clamp(-5, 0, 10)).toBe(0);
			expect(clamp(15, 0, 10)).toBe(10);
		});
	});

	describe("formatCoordinate", () => {
		it("formats coordinates to 4 decimal places", () => {
			expect(formatCoordinate(12.345678)).toBe("12.3457");
			expect(formatCoordinate(0)).toBe("0.0000");
		});
	});

	describe("projectCoordinates", () => {
		it("returns normalized coordinates within bounds", () => {
			const pos = projectCoordinates(0, 0);
			expect(pos.left).toBe(50);
			expect(pos.top).toBe(50);
		});
	});

	describe("parseAttributesText", () => {
		it("parses multi-line key-value attributes", () => {
			const input = "Owner: Logistics Ops\nSpeed: 42 km/h\nSignal: Stable";
			const result = parseAttributesText(input);
			expect(result).toEqual([
				{ label: "Owner", value: "Logistics Ops" },
				{ label: "Speed", value: "42 km/h" },
				{ label: "Signal", value: "Stable" }
			]);
		});

		it("handles empty or whitespace-only lines", () => {
			const input = "Owner: Logistics Ops\n\n   \nSpeed: 42 km/h";
			const result = parseAttributesText(input);
			expect(result).toEqual([
				{ label: "Owner", value: "Logistics Ops" },
				{ label: "Speed", value: "42 km/h" }
			]);
		});

		it("handles attributes without a colon separator", () => {
			const input = "StandaloneNote";
			const result = parseAttributesText(input);
			expect(result).toEqual([{ label: "StandaloneNote", value: "" }]);
		});

		it("returns empty array for empty string", () => {
			expect(parseAttributesText("")).toEqual([]);
			expect(parseAttributesText("   ")).toEqual([]);
		});
	});

	describe("blankFormState", () => {
		it("returns default values when seed is not provided", () => {
			const state = blankFormState();
			expect(state.name).toBe("");
			expect(state.kind).toBe("Facility");
			expect(state.status).toBe("Active");
			expect(state.attributesText).toContain("Manager: Ops Center");
		});

		it("preserves seed entity attributes when editing", () => {
			const seed: GeoEntity = {
				id: "ENT-999",
				name: "Custom Drone",
				kind: "Vehicle",
				status: "Idle",
				latitude: 10.1234,
				longitude: 20.5678,
				description: "Testing drone",
				attributes: [
					{ label: "CustomKey", value: "CustomVal" },
					{ label: "Battery", value: "99%" }
				],
				updatedAt: "Just now"
			};

			const state = blankFormState(seed);
			expect(state.id).toBe("ENT-999");
			expect(state.name).toBe("Custom Drone");
			expect(state.kind).toBe("Vehicle");
			expect(state.status).toBe("Idle");
			expect(state.attributesText).toBe("CustomKey: CustomVal\nBattery: 99%");
		});
	});

	describe("formatTimeAgo", () => {
		it("returns Just now for empty or recent strings", () => {
			expect(formatTimeAgo("")).toBe("Just now");
			expect(formatTimeAgo("Just now")).toBe("Just now");
			expect(formatTimeAgo("Updated 5 min ago")).toBe("Updated 5 min ago");
		});

		it("formats ISO timestamps", () => {
			const now = new Date();
			expect(formatTimeAgo(now.toISOString())).toBe("Just now");

			const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
			expect(formatTimeAgo(tenMinutesAgo.toISOString())).toBe("10 min ago");

			const threeHoursAgo = new Date(Date.now() - 3 * 3600 * 1000);
			expect(formatTimeAgo(threeHoursAgo.toISOString())).toBe("3 hours ago");
		});
	});

	describe("extractValidationErrors", () => {
		it("handles object map of validation errors", () => {
			const details = {
				Name: "Name is required",
				Latitude: "Latitude must be between -90 and 90"
			};
			const result = extractValidationErrors(details);
			expect(result).toEqual({
				name: "Name is required",
				latitude: "Latitude must be between -90 and 90"
			});
		});

		it("handles array of validation error objects", () => {
			const details = [
				{ field: "Name", message: "Name is required" },
				{ field: "Longitude", message: "Longitude must be valid" }
			];
			const result = extractValidationErrors(details);
			expect(result).toEqual({
				name: "Name is required",
				longitude: "Longitude must be valid"
			});
		});

		it("handles null/undefined/empty details gracefully", () => {
			expect(extractValidationErrors(null)).toEqual({});
			expect(extractValidationErrors(undefined)).toEqual({});
		});
	});
});
