import { MigrationInterface, QueryRunner } from 'typeorm';

export class NextMigration1788022525140 implements MigrationInterface {
  name = 'NextMigration1788022525140';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "villages" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(150) NOT NULL, "district" character varying(150) NOT NULL, "state" character varying(100) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_village_location_name" UNIQUE ("name", "district", "state"), CONSTRAINT "PK_3d9cf7c71c05c7ef684331317bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_village_active" ON "villages" ("isActive") `,
    );
    await queryRunner.query(
      `CREATE TABLE "procedures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "category" character varying(100), "description" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_procedure_name" UNIQUE ("name"), CONSTRAINT "PK_e7775bab78f27b4c47580b6cb4b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_procedure_active_category" ON "procedures" ("isActive", "category") `,
    );
    await queryRunner.query(
      `CREATE TABLE "hospital_procedures" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hospitalId" uuid NOT NULL, "procedureId" uuid NOT NULL, "priceMin" numeric, "priceMax" numeric, "doctorChargeMin" numeric, "doctorChargeMax" numeric, "operationChargeMin" numeric, "operationChargeMax" numeric, "otChargeMin" numeric, "otChargeMax" numeric, "roomChargeMin" numeric, "roomChargeMax" numeric, "anesthesiaChargeMin" numeric, "anesthesiaChargeMax" numeric, "medicineChargeMin" numeric, "medicineChargeMax" numeric, "testChargeMin" numeric, "testChargeMax" numeric, "otherChargeMin" numeric, "otherChargeMax" numeric, "notes" text, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_hospital_procedure" UNIQUE ("hospitalId", "procedureId"), CONSTRAINT "PK_75d77423b449e287023f9b61210" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_hospital_procedure_active" ON "hospital_procedures" ("isActive") `,
    );
    await queryRunner.query(
      `CREATE TABLE "schemes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "description" text, "state" character varying(100), "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_scheme_name_state" UNIQUE ("name", "state"), CONSTRAINT "PK_fd989991874a1aab8856e326cd3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_scheme_active_state" ON "schemes" ("isActive", "state") `,
    );
    await queryRunner.query(
      `CREATE TABLE "hospital_schemes" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "hospitalId" uuid NOT NULL, "schemeId" uuid NOT NULL, "isAvailable" boolean NOT NULL DEFAULT false, "notes" text, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_hospital_scheme" UNIQUE ("hospitalId", "schemeId"), CONSTRAINT "PK_379913ed2c55d8a5b7f4d4cd323" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."hospitals_hospitaltype_enum" AS ENUM('government', 'private', 'trust', 'other')`,
    );
    await queryRunner.query(
      `CREATE TABLE "hospitals" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(200) NOT NULL, "hospitalType" "public"."hospitals_hospitaltype_enum" NOT NULL, "description" text, "villageId" uuid NOT NULL, "address" character varying(300) NOT NULL, "district" character varying(150) NOT NULL, "state" character varying(100) NOT NULL, "phone" character varying(30), "emergencyPhone" character varying(30), "email" character varying(200), "website" character varying(300), "emergencyAvailable" boolean NOT NULL DEFAULT false, "ambulanceAvailable" boolean NOT NULL DEFAULT false, "icuAvailable" boolean NOT NULL DEFAULT false, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "uq_hospital_location_name" UNIQUE ("name", "villageId"), CONSTRAINT "PK_02738c80d71453bc3e369a01766" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_hospital_active_type" ON "hospitals" ("isActive", "hospitalType") `,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_procedures" ADD CONSTRAINT "FK_1f16f1b6b265c37f856cdffa65c" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_procedures" ADD CONSTRAINT "FK_2e78ce963f5a1e76acc2307ab15" FOREIGN KEY ("procedureId") REFERENCES "procedures"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_schemes" ADD CONSTRAINT "FK_9d126807e5b2964f07d81d4ffa3" FOREIGN KEY ("hospitalId") REFERENCES "hospitals"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_schemes" ADD CONSTRAINT "FK_0c0f0bcfaad4bddcfce7e9a1ef9" FOREIGN KEY ("schemeId") REFERENCES "schemes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospitals" ADD CONSTRAINT "FK_e954d94a0840d2283942c0e7f10" FOREIGN KEY ("villageId") REFERENCES "villages"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "hospitals" DROP CONSTRAINT "FK_e954d94a0840d2283942c0e7f10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_schemes" DROP CONSTRAINT "FK_0c0f0bcfaad4bddcfce7e9a1ef9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_schemes" DROP CONSTRAINT "FK_9d126807e5b2964f07d81d4ffa3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_procedures" DROP CONSTRAINT "FK_2e78ce963f5a1e76acc2307ab15"`,
    );
    await queryRunner.query(
      `ALTER TABLE "hospital_procedures" DROP CONSTRAINT "FK_1f16f1b6b265c37f856cdffa65c"`,
    );
    await queryRunner.query(`DROP INDEX "public"."idx_hospital_active_type"`);
    await queryRunner.query(`DROP TABLE "hospitals"`);
    await queryRunner.query(`DROP TYPE "public"."hospitals_hospitaltype_enum"`);
    await queryRunner.query(`DROP TABLE "hospital_schemes"`);
    await queryRunner.query(`DROP INDEX "public"."idx_scheme_active_state"`);
    await queryRunner.query(`DROP TABLE "schemes"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_hospital_procedure_active"`,
    );
    await queryRunner.query(`DROP TABLE "hospital_procedures"`);
    await queryRunner.query(
      `DROP INDEX "public"."idx_procedure_active_category"`,
    );
    await queryRunner.query(`DROP TABLE "procedures"`);
    await queryRunner.query(`DROP INDEX "public"."idx_village_active"`);
    await queryRunner.query(`DROP TABLE "villages"`);
  }
}
