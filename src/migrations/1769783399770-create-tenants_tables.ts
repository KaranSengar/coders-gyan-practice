import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTenantsTables1769783399770 implements MigrationInterface {
  name = "CreateTenantsTables1769783399770";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" DROP CONSTRAINT "FK_7008a2b0fb083127f60b5f4448e"`,
    );
    await queryRunner.query(
      `CREATE TABLE "tenants" ("id" SERIAL NOT NULL, "address" character varying(255) NOT NULL, "name" character varying(100) NOT NULL, "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_53be67a04681c66b87ee27c9321" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tenants"`);
    await queryRunner.query(
      `ALTER TABLE "refreshTokens" ADD CONSTRAINT "FK_7008a2b0fb083127f60b5f4448e" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
