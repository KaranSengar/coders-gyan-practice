import { Repository } from "typeorm";
import { User } from "../Entity/User.entiry";
import type { LimitedUserData, UserRequest } from "../type";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
export class Userservice {
  constructor(private userRepository: Repository<User>) {}
  async create({
    firstName,
    lastName,
    email,
    password,
    role,
    tenantId,
  }: UserRequest) {
    //console.log(data, "data")

    const user = await this.userRepository.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      const err = createHttpError(400, "Email is already exists");
      throw err;
    }

    const hashpassword = await bcrypt.hash(password, 10);
    // const userrepo = AppDataSource.getRepository<User>(User)
    try {
      const user = await this.userRepository.save({
        firstName,
        lastName,
        password: hashpassword,
        email,
        role,
        tenant: tenantId ? { id: tenantId } : undefined,
      });
      //  console.log(user.password)
      return user;

      // console.log(user.id,"id is")
    } catch (err) {
      const error = createHttpError(
        500,
        "failed to store the data in the database ",
        err,
      );
      throw error;
    }
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findOne({
      where: {
        email,
      },
      select: ["id", "firstName", "lastName", "email", "role", "password"],
      relations: {
        tenant: true,
      },
    });
    return user;
  }

  async findById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      relations: {
        tenant: true,
      },
    });
  }
  async getAll(): Promise<User[]> {
    return this.userRepository.find(); // ✅ MUST return
  }

  async update(
    UserId: number,
    { firstName, lastName, role, tenantId }: LimitedUserData,
  ) {
    return await this.userRepository.update(UserId, {
      firstName,
      lastName,
      role,
      tenant: tenantId ? { id: tenantId } : null,
    });
  }
  async deleteById(userId: number) {
    return await this.userRepository.delete(userId);
  }
}
