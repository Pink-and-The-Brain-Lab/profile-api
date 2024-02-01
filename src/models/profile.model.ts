import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('profiles')
class Profile {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    
}

export default Profile;
