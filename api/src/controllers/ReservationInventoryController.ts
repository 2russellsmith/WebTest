import {Controller, Get, Post} from '@overnightjs/core'
import { Request, Response } from 'express'
import {ReservationInventory} from "../models";
import {Sequelize} from "sequelize-typescript";
import * as models from "../models";

@Controller('reservationInventory')
export class ReservationInventoryController {
    @Post('create')
    private async post(req: Request, res: Response) {
        try {
            const newInventory: ReservationInventory = await ReservationInventory.create(req.body)
            console.log("Added inventory")
            return res.status(200).json(newInventory);
        } catch (e) {
            if (e.name == "SequelizeValidationError") {
                console.log("Validation Error on adding inventory")
                return res.status(400).send(e.message)
            } else {

                console.log("Error on adding inventory " + e.message)
                return res.status(500).send(e.message);
            }
        }
    }

    @Post('createEvery15Min')
    private async postInventoryRange(req: Request, res: Response) {
        interface PostInventoryRequest {
            restaurantId: number;
            startDate: Date;
            endDate: Date;
            periodInDays: number;
            startTime: Date;
            endTime: Date;
            maxPartySize: number;
            availabilityCount: number;
        }
        try {
            // TODO: Dedicated parse functions/parse library
            const data: PostInventoryRequest =  req.body;
            //Zeroing out the time on the start and end dates since the time is
            data.startDate = new Date(req.body.startDate);
            data.startDate.setHours(0,0,0,0)
            data.endDate = new Date(req.body.endDate);
            data.endDate.setHours(0,0,0,0)
            // Depending on use case, could this be passed in as a set of Strings in the request?
            data.startTime = new Date(req.body.startTime);
            data.endTime = new Date(req.body.endTime);
            data.periodInDays = parseInt(req.body.periodInDays);
            data.maxPartySize = parseInt(req.body.maxPartySize);
            data.availabilityCount = parseInt(req.body.availabilityCount);
            data.restaurantId = parseInt(req.body.restaurantId);
            const times: String[] = this.getEvery15MinInterval(data.startTime, data.endTime);
            // TODO: Centralize getting sequelize db connection
            //Setup connection for sequelize transactions
            const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
                dialect: 'postgres',
                logging: process.env.LOG === 'debug' ? console.log : false,
                models: Object.keys(models).map(k => models[k]),
            })
            const t = await sequelize.transaction();
            try {
                let inventoryDate: Date = data.startDate;
                while (inventoryDate.getTime() <= data.endDate.getTime()) {
                    for (const time of times) {
                        const newInventory: ReservationInventory = await ReservationInventory.create({
                            restaurantId: data.restaurantId,
                            reservationDate: inventoryDate,
                            reservationTime: time,
                            maxPartySize: data.maxPartySize,
                            availabilityCount: data.availabilityCount
                        }, t)
                    }
                    inventoryDate.setDate(inventoryDate.getDate() + data.periodInDays);
                }
                await t.commit();
                console.log("Added all inventory in range")
            }
            catch(e) {
                console.log("Error Adding all inventory in range " + e.message)
                console.log(e)
                await t.rollback()
            }
            return res.sendStatus(200);
        } catch (e) {
            console.log(e)
            return res.status(500).send(e.message);
        }
    }

    @Get('')
    private async get(req: Request, res: Response) {
        await ReservationInventory.findAll()
            .then(reservations => {
                res.json(reservations);
                res.status(200)
            })
        return res;
    }

    private getEvery15MinInterval(startTime: Date, endTime: Date) {
        //TODO: Add in logic to parse times
        return ["3:00", "3:15"];
    }
}
