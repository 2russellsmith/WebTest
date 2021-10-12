import {Controller, Get, Post, Put} from '@overnightjs/core'
import { Request, Response } from 'express'
import { Restaurant} from "../models";

@Controller('restaurant')
export class RestaurantController {
    @Post('/')
    private async post(req: Request, res: Response) {
        try {
            const newRestaurant = await Restaurant.create(req.body)
            return res.status(200).json(newRestaurant);
        } catch (e) {
            if (e.name == "SequelizeValidationError") {
                return res.status(400).send(e.message)
            } else {
                return res.status(500).send(e.message);
            }
        }
    }

    @Get('')
    private async getAll(req: Request, res: Response) {
        try {
            const restaurants = await Restaurant.findAll();
            return res.status(200).json(restaurants)
        } catch (e) {
            return res.sendStatus(500)
        }
    }

    @Get(':id')
    private async get(req: Request, res: Response) {
        try {
            const restaurants = await Restaurant.findByPk(parseInt(req.params.id));
            return res.status(200).json(restaurants)
        } catch (e) {
            return res.sendStatus(500)
        }
    }
}
