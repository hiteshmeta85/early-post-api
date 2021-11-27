import {getConnection} from "typeorm";
import {Order} from "../entities/Order";

const OrderController = {
    create: async (req: any, res: any) => {
        if(Object.keys(req.body.orderItems).length === 0){
            return res.status(400).send({errors: 'Something went wrong.'})
        }

        try {
            await getConnection()
                .createQueryBuilder()
                .insert()
                .into(Order)
                .values({
                        orderItems: req.body.orderItems,
                        user: req.body.whoSentTheRequest
                    }
                )
                .returning('id')
                .execute();
            return res.status(200).send({data: 'Successful added your order.'})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    },
    fetch: async (req: any, res: any) => {
        try {
            const result = await getConnection()
                .createQueryBuilder()
                .select()
                .from(Order, 'order')
                .where({user: req.body.whoSentTheRequest})
                .execute()
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(400).send({errors: 'Something went wrong.'})
        }
    },
    fetchPendingOrders: async (_req: any, res: any) => {
        try {
            const result = await getConnection()
                .getRepository(Order)
                .createQueryBuilder('order')
                .innerJoinAndSelect('order.user', 'user')
                .where({status: 'Order Pending'})
                .getMany()
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(500)
        }
    },
    fetchAllOrders: async (_req: any, res: any) => {
        try {
            const result = await getConnection()
                .getRepository(Order)
                .createQueryBuilder('order')
                .innerJoinAndSelect('order.user', 'user')
                .getMany()
            return res.status(200).send({data: result})
        } catch (err) {
            return res.status(500)
        }
    },
    fetchIndividualPendingOrder: async (req: any, res: any) => {
        try {
            const result = await getConnection()
                .getRepository(Order)
                .createQueryBuilder('order')
                .innerJoinAndSelect('order.user', 'user')
                .where({id: req.params.id,status:'Order Pending'})
                .execute()
            return res.status(201).send({data:result})
        } catch (err){
            res.send(400).send({data:'Something went wrong.'})
        }
    },
    updateIndividualPendingOrder: async (req: any, res:any) => {
        try{
            const result = await getConnection()
                .createQueryBuilder()
                .update(Order)
                .set({deliveryService: req.body.deliveryService, status: 'In Process'})
                .where({id: req.params.id})
                .returning("*")
                .execute();
            return res.status(200).send({data: result})
        }
        catch (err) {
            res.send(500)
        }
    }
}

export default OrderController