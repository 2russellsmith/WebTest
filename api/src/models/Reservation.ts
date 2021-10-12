import {
    Column,
    CreatedAt,
    DeletedAt, ForeignKey,
    Model,
    PrimaryKey, Table,
    UpdatedAt
} from 'sequelize-typescript'
import {ReservationInventory} from "./ReservationInventory";

@Table({ tableName: 'reservation' })
export class Reservation extends Model<Reservation> {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number

    @Column({allowNull: false})
    name: string

    @Column
    email: string

    @Column({allowNull: false, validate: {min: 1}})
    partySize: number

    @Column
    date: Date

    @Column
    time: String

    @Column({allowNull: false})
    @ForeignKey(() => ReservationInventory)
    inventoryId: number

    @DeletedAt
    deleted_at: string

    @CreatedAt
    created_at: string

    @UpdatedAt
    updated_at: string

    async createReservationFromInventory(reservationInventory: ReservationInventory, data, t) {
    }

    static async createReservationFromInventory(reservationInventory: ReservationInventory, data, t) {
        const reservation:Reservation = await Reservation.create({
            name: data.name,
            email: data.email,
            partySize: data.partySize,
            date: reservationInventory.reservationDate,
            time: reservationInventory.reservationTime,
            inventoryId: reservationInventory.id
        }, t);
        return reservation;
    }
}
