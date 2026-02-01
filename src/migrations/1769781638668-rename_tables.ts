import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTables1769781638668 implements MigrationInterface {
  name = "RenameTables1769781638668";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.renameTable("user", "users");
    await queryRunner.renameTable("refresh_token", "refreshTokens");

    await queryRunner.query(
      `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_7008a2b0fb083127f60b5f4448e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_7008a2b0fb083127f60b5f4448e"`,
    );
    await queryRunner.renameTable("users", "user");
    await queryRunner.renameTable("refreshTokens", "refresh_token");
  }
}
