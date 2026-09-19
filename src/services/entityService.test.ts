import {
	CreateEntityPayload,
	GeoEntity,
	UpdateEntityPayload
} from "../domain/geospatial-entity";
import { apiClient, entityService } from "./entityService";

jest.mock("axios", () => {
	const mockAxiosInstance = {
		get: jest.fn(),
		post: jest.fn(),
		put: jest.fn(),
		delete: jest.fn()
	};
	return {
		create: jest.fn(() => mockAxiosInstance),
		...mockAxiosInstance
	};
});

describe("entityService", () => {
	const mockEntity: GeoEntity = {
		id: "ENT-001",
		name: "Harbor Shuttle 12",
		kind: "Vehicle",
		status: "Active",
		latitude: -6.1754,
		longitude: 106.8272,
		description: "Shuttle unit",
		attributes: [{ label: "Owner", value: "Logistics Ops" }],
		updatedAt: "2026-09-19T10:00:00Z"
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe("getEntities", () => {
		it("fetches entities without parameters", async () => {
			(apiClient.get as jest.Mock).mockResolvedValueOnce({
				data: { success: true, data: [mockEntity] }
			});

			const result = await entityService.getEntities();
			expect(apiClient.get).toHaveBeenCalledWith("/entities", { params: {} });
			expect(result).toEqual([mockEntity]);
		});

		it("fetches entities with query parameters", async () => {
			(apiClient.get as jest.Mock).mockResolvedValueOnce({
				data: { success: true, data: [mockEntity] }
			});

			const result = await entityService.getEntities({
				kind: "Vehicle",
				status: "Active",
				search: "Harbor"
			});

			expect(apiClient.get).toHaveBeenCalledWith("/entities", {
				params: { kind: "Vehicle", status: "Active", search: "Harbor" }
			});
			expect(result).toEqual([mockEntity]);
		});
	});

	describe("getEntityById", () => {
		it("fetches a single entity by id", async () => {
			(apiClient.get as jest.Mock).mockResolvedValueOnce({
				data: { success: true, data: mockEntity }
			});

			const result = await entityService.getEntityById("ENT-001");
			expect(apiClient.get).toHaveBeenCalledWith("/entities/ENT-001");
			expect(result).toEqual(mockEntity);
		});
	});

	describe("createEntity", () => {
		it("posts create payload to /entities", async () => {
			const payload: CreateEntityPayload = {
				name: "Delivery Drone 05",
				kind: "Vehicle",
				status: "Active",
				latitude: -6.2088,
				longitude: 106.8456,
				description: "Drone test",
				attributes: [{ label: "Battery", value: "95%" }]
			};

			(apiClient.post as jest.Mock).mockResolvedValueOnce({
				data: { success: true, data: { ...mockEntity, ...payload } }
			});

			const result = await entityService.createEntity(payload);
			expect(apiClient.post).toHaveBeenCalledWith("/entities", payload);
			expect(result.name).toBe("Delivery Drone 05");
		});
	});

	describe("updateEntity", () => {
		it("puts update payload to /entities/:id", async () => {
			const payload: UpdateEntityPayload = {
				name: "Harbor Shuttle 12 - Updated",
				status: "Maintenance"
			};

			(apiClient.put as jest.Mock).mockResolvedValueOnce({
				data: { success: true, data: { ...mockEntity, ...payload } }
			});

			const result = await entityService.updateEntity("ENT-001", payload);
			expect(apiClient.put).toHaveBeenCalledWith("/entities/ENT-001", payload);
			expect(result.name).toBe("Harbor Shuttle 12 - Updated");
		});
	});

	describe("deleteEntity", () => {
		it("deletes an entity by id", async () => {
			(apiClient.delete as jest.Mock).mockResolvedValueOnce({
				data: { success: true, message: "Deleted" }
			});

			await entityService.deleteEntity("ENT-001");
			expect(apiClient.delete).toHaveBeenCalledWith("/entities/ENT-001");
		});
	});

	describe("getMetrics", () => {
		it("fetches entity metrics", async () => {
			const mockMetrics = {
				totalCount: 10,
				activeCount: 6,
				offlineCount: 2,
				facilityCount: 2
			};

			(apiClient.get as jest.Mock).mockResolvedValueOnce({
				data: { success: true, data: mockMetrics }
			});

			const result = await entityService.getMetrics();
			expect(apiClient.get).toHaveBeenCalledWith("/entities/metrics");
			expect(result).toEqual(mockMetrics);
		});
	});
});
