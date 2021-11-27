import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn , ManyToOne} from "typeorm";
import {User} from "./User";

@Entity()
export class Order {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    orderItems: string;

    @Column({default: 'Order Pending'})
    status: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column({default:null})
    deliveryService: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User , user => user.orders)
    user: User;
}
