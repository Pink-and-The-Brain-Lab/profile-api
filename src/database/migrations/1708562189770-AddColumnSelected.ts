import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnSelected1708562189770 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE profiles ADD COLUMN selected boolean DEFAULT false');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE profiles DROP COLUMN selected');
    }
}
