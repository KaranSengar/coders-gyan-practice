import { createTenant } from "../../utils/index";
import { Repository } from "typeorm";
import { Tenant } from "../../Entity/Tenant";

describe("createTenant", () => {
    it("creates a tenant", async () => {
        const mockRepo: unknown = { save: jest.fn().mockResolvedValue({ id: 1, name: "Test tenant" }) };
        const tenant = await createTenant(mockRepo as Repository<Tenant>);
        expect(tenant.name).toBe("Test tenant");
    });
}
);
