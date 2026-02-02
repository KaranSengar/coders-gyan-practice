import { truncateTable } from "../../utils/index";
import { DataSource } from "typeorm";

describe("truncateTable", () => {
    it("clears all tables", async () => {
        const mockRepo = { clear: jest.fn() };
        const mockConnection: unknown = {
            entityMetadatas: [{ name: "Tenant" }],
            getRepository: jest.fn().mockReturnValue(mockRepo),
        };
        await truncateTable(mockConnection as DataSource);
        expect(mockRepo.clear).toHaveBeenCalled();
    });
});
