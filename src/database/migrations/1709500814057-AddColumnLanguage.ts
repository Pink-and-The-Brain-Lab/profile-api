import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnLanguage1709500814057 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE profiles ADD COLUMN language varchar DEFAULT 'en'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE profiles DROP COLUMN language');
    }

}
