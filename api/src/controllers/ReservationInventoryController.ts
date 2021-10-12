import {Controller, Get, Post} from '@overnightjs/core'
import { Request, Response } from 'express'
import {Inventory} from "../models";

@Controller('inventory')
export class InventoryController {
    @Post('/')
    private async post(req: Request, res: Response) {
        try {
            const newInventory = await Inventory.create(req.body)
            return res.status(200).json(newInventory);
        } catch (e) {
            if (e.name == "SequelizeValidationError") {
                return res.status(400).send(e.message)
            } else {
                return res.status(500).send(e.message);
            }
        }
    }

    @Get('')
    private async get(req: Request, res: Response) {
        await Inventory.findAll()
            .then(reservations => {
                res.json(reservations);
                res.status(200)
            })
        return res;
    }
}
