import {Controller, Get, Post} from '@overnightjs/core'
import { Request, Response } from 'express'
import {Reservation, ReservationInventory} from "../models";
import {Sequelize} from "sequelize-typescript";
import * as models from "../models";
import {Transaction} from "sequelize";

@Controller('reservation')
export class ReservationController {
    @Post('/')
    async post(req: Request, res: Response) {
        interface PostReservationRequest {
            name: string;
            email: string;
            partySize: number;
            inventoryId: number;
        }
        // TODO: Centralize this
        //Setup connection for sequelize transactions
        const sequelize = new Sequelize(process.env.DATABASE_CONNECTION_STRING, {
            dialect: 'postgres',
            logging: process.env.LOG === 'debug' ? console.log : false,
            models: Object.keys(models).map(k => models[k]),
        })
        const data: PostReservationRequest =  req.body;
        data.name = req.body.name;
        data.email = req.body.email;
        data.inventoryId = parseInt(req.body.inventoryId);
        data.partySize = parseInt(req.body.partySize);
        const t = await sequelize.transaction();
        try {
            // TODO: Dedicated parse functions/parse library
            // Check that the reservation inventory is there and has availability
            const reservationInventory: ReservationInventory = await ReservationInventory.getAndLock(data.inventoryId, t);
            if (this.validReservation(reservationInventory, data.partySize)) {
                await ReservationInventory.removeAvailableInventory(reservationInventory, t)
                const newReservation:Reservation = await Reservation.createReservationFromInventory(reservationInventory, data, t)
                await t.commit();
                console.log("Added reservation")
                return res.status(200).json(newReservation);
            } else {
                // If the reservation doesn't match the criteria, give up the lock on the row.
                t.commit();
                return res.status(400).send("The reservation is not available/doesn't fit party requirements");
            }
        } catch (e) {
            console.log(e)
            await t.rollback()
            return res.status(500).send(e.message);
        }
    }

  @Get('')
  private async getAll(req: Request, res: Response) {
    await Reservation.findAll()
        .then(reservations => {
          res.json(reservations);
          res.status(200)
        })
    return res;
  }

    @Get('byName')
    private async getByName(req: Request, res: Response) {
        try {
            const reservations = await Reservation.findAll({where: {name: req.query.name}});
            return res.status(200).json(reservations)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }

    @Get('byEmail')
    private async getByEmail(req: Request, res: Response) {
        try {
            const reservations = await Reservation.findAll({where: {name: req.query.email}});
            return res.status(200).json(reservations)
        } catch (e) {
            console.log(e)
            return res.sendStatus(500)
        }
    }
    protected validReservation(reservationInventory: ReservationInventory, partySize: number) {
        return reservationInventory != null &&
            reservationInventory.availabilityCount > 0 &&
            reservationInventory.maxPartySize >= partySize
    }
}
