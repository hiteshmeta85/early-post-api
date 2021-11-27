import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn , ManyToOne} from "typeorm";
import {User} from "./User";

@Entity()
export class Query {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column()
    description!: string;

    @Column({default: false})
    status: boolean;

    @Column({default: null})
    reply: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User , user => user.queries)
    user: User;
}
