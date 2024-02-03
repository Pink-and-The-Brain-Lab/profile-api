import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class UserProfile1706998803968 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'profiles',
                columns: [{
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    }, {
                        name: 'userId',
                        type: 'varchar',
                        isNullable: false,
                    }, {
                        name: 'profileType',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'email',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'color',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'image',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'chosenName',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'profileName',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'profileVisibility',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'profileTheme',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'logoutTime',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'dateFormat',
                        type: 'varchar',
                        isNullable: true,
                    }, {
                        name: 'validated',
                        type: 'boolean',
                        isNullable: false,
                        default: false,
                    }
                ]
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('profiles');
    }

}
