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

    @Column
    @ForeignKey(() => ReservationInventory)
    inventoryId: number

    @DeletedAt
    deleted_at: string

    @CreatedAt
    created_at: string

    @UpdatedAt
    updated_at: string
}
