import { Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'
import {Reservation} from "../models";

@Controller('test')
export class TestController {
  @Get('')
  private async get(req: Request, res: Response) {
    await Reservation.findAll()
        .then(reservations => {
          res.json(reservations);
          res.status(200)
        })
        .catch((error) => {
          res.status(500)
        })
    return res;
  }
}
