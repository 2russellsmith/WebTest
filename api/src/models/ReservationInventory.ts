import {
    Column,
    CreatedAt,
    DeletedAt, ForeignKey,
    Model,
    PrimaryKey, Table,
    UpdatedAt
} from 'sequelize-typescript'
import {Restaurant} from "./Restaurant";

@Table({ tableName: 'inventory' })
export class ReservationInventory extends Model<ReservationInventory> {
    @PrimaryKey
    @Column({ autoIncrement: true })
    id: number

    @Column
    @ForeignKey(() => Restaurant)
    restaurant: number

    @Column
    availabilityCount

    @DeletedAt
    deleted_at: string

    @CreatedAt
    created_at: string

    @UpdatedAt
    updated_at: string
}
