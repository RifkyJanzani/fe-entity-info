import { act, renderHook } from "@testing-library/react";

import { GeoEntity } from "../domain/geospatial-entity";
import { entityService } from "../services/entityService";
import { useEntityDashboard } from "./useEntityDashboard";

jest.mock("../services/entityService", () => ({
	entityService: {
		getEntities: jest.fn(),
		getEntityById: jest.fn(),
		createEntity: jest.fn(),
		updateEntity: jest.fn(),
		deleteEntity: jest.fn(),
		getMetrics: jest.fn()
	}
}));

describe("useEntityDashboard hook", () => {
	const mockEntities: GeoEntity[] = [
		{
			id: "ENT-001",
			name: "Harbor Shuttle 12",
			kind: "Vehicle",
			status: "Active",
			latitude: -6.1754,
			longitude: 106.8272,
			description: "Shuttle unit",
			attributes: [{ label: "Owner", value: "Logistics Ops" }],
			updatedAt: "2026-09-19T10:00:00Z"
		},
		{
			id: "ENT-002",
			name: "Cold Room Sensor",
			kind: "IoT Device",
			status: "Idle",
			latitude: 1.3521,
			longitude: 103.8198,
			description: "Sensors",
			attributes: [],
			updatedAt: "2026-09-19T10:05:00Z"
		}
	];

	const mockMetrics = {
		totalCount: 2,
		activeCount: 1,
		offlineCount: 0,
		facilityCount: 0
	};

	beforeEach(() => {
		jest.clearAllMocks();
		(entityService.getEntities as jest.Mock).mockResolvedValue(mockEntities);
		(entityService.getMetrics as jest.Mock).mockResolvedValue(mockMetrics);
	});

	it("fetches entities and metrics on mount", async () => {
		const { result } = renderHook(() => useEntityDashboard());

		await act(async () => {
			await Promise.resolve();
		});

		expect(entityService.getEntities).toHaveBeenCalled();
		expect(entityService.getMetrics).toHaveBeenCalled();
		expect(result.current.entities.length).toBe(2);
		expect(result.current.selectedId).toBe("ENT-001");
		expect(result.current.stats.totalCount).toBe(2);
	});

	it("opens and closes modal properly", async () => {
		const { result } = renderHook(() => useEntityDashboard());

		await act(async () => {
			await Promise.resolve();
		});

		await act(async () => {
			result.current.openAddModal();
		});
		expect(result.current.modalMode).toBe("add");
		expect(result.current.draft.name).toBe("");

		await act(async () => {
			result.current.closeModal();
		});
		expect(result.current.modalMode).toBeNull();
	});

	it("validates draft on submit and prevents call if invalid", async () => {
		const { result } = renderHook(() => useEntityDashboard());

		await act(async () => {
			await Promise.resolve();
		});

		await act(async () => {
			result.current.openAddModal();
		});

		// Submit with empty name
		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(result.current.errors.name).toBe("Name is required.");
		expect(entityService.createEntity).not.toHaveBeenCalled();
	});

	it("creates a new entity on valid submission", async () => {
		const newEntity: GeoEntity = {
			id: "ENT-NEW",
			name: "New Vessel",
			kind: "Vehicle",
			status: "Active",
			latitude: 10.0,
			longitude: 20.0,
			description: "New description",
			attributes: [],
			updatedAt: "2026-09-19T11:00:00Z"
		};
		(entityService.createEntity as jest.Mock).mockResolvedValueOnce(newEntity);

		const { result } = renderHook(() => useEntityDashboard());

		await act(async () => {
			await Promise.resolve();
		});

		await act(async () => {
			result.current.openAddModal();
		});

		act(() => {
			result.current.setDraft({
				name: "New Vessel",
				kind: "Vehicle",
				status: "Active",
				latitude: "10.0000",
				longitude: "20.0000",
				description: "New description",
				attributesText: ""
			});
		});

		await act(async () => {
			await result.current.handleSubmit();
		});

		expect(entityService.createEntity).toHaveBeenCalled();
		expect(result.current.modalMode).toBeNull();
		expect(result.current.selectedId).toBe("ENT-NEW");
	});

	it("deletes an entity", async () => {
		(entityService.deleteEntity as jest.Mock).mockResolvedValueOnce(undefined);

		const { result } = renderHook(() => useEntityDashboard());

		await act(async () => {
			await Promise.resolve();
		});

		expect(result.current.entities.length).toBe(2);

		await act(async () => {
			await result.current.handleDelete("ENT-001");
		});

		expect(entityService.deleteEntity).toHaveBeenCalledWith("ENT-001");
		expect(result.current.entities.some((e) => e.id === "ENT-001")).toBe(false);
	});
});
