import { Repository } from "typeorm";
import { ITenant } from "../type";
import { Tenant } from "../Entity/Tenant";

export class TenantService {
  constructor(private readonly tenantRepository: Repository<Tenant>) {}
  async create(tenantData: ITenant) {
    const tenant = await this.tenantRepository.save(tenantData);
    return tenant;
  }

  async update(id: number, tenantData: ITenant) {
    return await this.tenantRepository.update(id, tenantData);
  }

  async getAll() {
    return await this.tenantRepository.find();
  }

  async getById(tenantId: number) {
    return await this.tenantRepository.findOne({ where: { id: tenantId } });
  }

  async deleteById(tenantId: number) {
    return await this.tenantRepository.delete(tenantId);
  }
}
