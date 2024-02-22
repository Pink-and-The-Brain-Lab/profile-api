import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('profiles')
class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    userId: string;

    @Column()
    email: string;

    @Column()
    color: string;

    @Column()
    image: string;

    @Column()
    chosenName: string;

    @Column()
    profileName: string;

    @Column()
    profileVisibility: string;

    @Column()
    profileTheme: string;

    @Column()
    logoutTime: string;

    @Column()
    dateFormat: string;

    @Column()
    validated: boolean;

    @Column()
    selected: boolean;
}

export default Profile;
