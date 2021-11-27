import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany} from "typeorm";
import {Query} from "./Query";
import {Order} from "./Order";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({unique:true})
    email!: string;

    @Column()
    password!: string;

    @Column()
    address!: string;

    @Column()
    pincode!: number;

    @Column()
    phone!: string;

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date

    @OneToMany(()=> Query, query => query.user)
    queries: Query[]

    @OneToMany(()=> Order, order => order.user)
    orders:  Order[]
}
