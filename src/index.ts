import express = require("express");
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';

const app = express()
import path = require('path')

require('dotenv').config({path: path.join(__dirname, '../.env')})
const port = process.env.API_PORT
import {createConnection} from 'typeorm'

import cors = require('cors')
import bodyParser = require('body-parser')

import {User} from "./entities/User";
import UserController from "./controllers/UserController";
import SessionController from "./controllers/SessionController";
import QueryController from "./controllers/QueryController";
import {Query} from "./entities/Query";
import isAuthenticated from "./middleware/isAuthenticated";
import {Order} from "./entities/Order";
import OrderController from "./controllers/OrderController";

const router = express.Router()

const main = async () => {
    app.use(bodyParser.json())
    app.use(cors({origin: process.env.FRONTEND_SERVER, credentials: true}))

    await createConnection({
        type: 'postgres',
        host: process.env.DB_HOST as string,
        port: process.env.DB_PORT as any,
        username: process.env.DB_USER as string,
        password: process.env.DB_PWD as string,
        database: process.env.DB_NAME as string,
        synchronize: true,
        entities: [User, Query, Order],
        logging: true,
    })

    const RedisStore = connectRedis(session)
    const redisClient = redis.createClient({port: 6379, host: 'localhost'});

    app.use(
        session({
            name: `${process.env.SESSION_NAME}`,
            store: new RedisStore({client: redisClient, disableTouch: true}),
            saveUninitialized: false,
            secret: `${process.env.SESSION_SECRET}`, //add to env file
            resave: false,
            cookie: {
                maxAge: 1000 * 60 * 60 * 24, //1 day
                httpOnly: true,
                sameSite: 'lax',
                secure: false // for production
            }
        })
    )

    //Routes -- User
    //Sessions
    router.put('/user/session', SessionController.create)
    router.get('/user/session', isAuthenticated, SessionController.show)
    router.delete('/user/session', isAuthenticated, SessionController.destroy)

    //User
    router.post('/user', UserController.create)
    router.get('/user', isAuthenticated, UserController.index)
    router.put('/user', isAuthenticated, UserController.update)

    //Queries
    router.post('/user/query', isAuthenticated, QueryController.create)
    router.get('/user/query', isAuthenticated, QueryController.index)

    //orders
    router.post('/user/order', isAuthenticated, OrderController.create)
    router.get('/user/order', isAuthenticated, OrderController.fetch)

    //Routes --Admin
    //Query
    router.get('/admin/query', QueryController.fetch)
    router.get('/admin/query/:id', QueryController.getIndividual)
    router.put('/admin/query/:id', QueryController.update)

    //Orders
    router.get('/admin/pending-orders',OrderController.fetchPendingOrders)
    router.get('/admin/pending-orders/:id',OrderController.fetchIndividualPendingOrder)
    router.put('/admin/pending-orders/:id',OrderController.updateIndividualPendingOrder)
    router.get('/admin/all-orders',OrderController.fetchAllOrders)

    app.use('/api', router)

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}/api`)
    })
}

main()
