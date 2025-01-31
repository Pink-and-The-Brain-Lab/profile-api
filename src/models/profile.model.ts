import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('profiles')
class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('text', { nullable: false })
    userId: string;

    @Column('text', { nullable: true })
    email: string;

    @Column('text', { nullable: true })
    color: string;

    @Column('text', { nullable: true })
    image: string;

    @Column('text', { nullable: true })
    chosenName: string;

    @Column('text', { nullable: true })
    profileName: string;

    @Column('text', { nullable: true })
    profileVisibility: string;

    @Column('text', { nullable: true })
    profileTheme: string;

    @Column('text', { nullable: true })
    logoutTime: string;

    @Column('text', { nullable: true })
    dateFormat: string;

    @Column('boolean', { nullable: true })
    validated: boolean;

    @Column('boolean', { nullable: true })
    selected: boolean;

    @Column('text', { nullable: true })
    language: string;

    @Column('float8', { nullable: true })
    createdat: number;
}

export default Profile;
