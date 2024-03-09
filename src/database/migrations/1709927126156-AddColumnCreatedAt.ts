import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnCreatedAt1709927126156 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE profiles ADD COLUMN createdat varchar DEFAULT ${new Date().getTime()}`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE profiles DROP COLUMN createdat');
    }

}
