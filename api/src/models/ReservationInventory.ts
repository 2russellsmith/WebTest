import {
    BelongsTo,
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

    @Column({allowNull: false})
    @ForeignKey(() => Restaurant)
    restaurantId: number

    @Column({allowNull: false, validate: {min: 0}})
    availabilityCount: number

    @Column({allowNull: false})
    reservationDate: Date

    @Column({allowNull: false})
    reservationTime: String

    @Column({allowNull: false, validate: {min: 1}})
    maxPartySize: number

    @DeletedAt
    deleted_at: string

    @CreatedAt
    created_at: string

    @UpdatedAt
    updated_at: string

    static async removeAvailableInventory(reservationInventory: ReservationInventory, t) {
        await this.update({availabilityCount: reservationInventory.availabilityCount - 1}, { where: { id: reservationInventory.id}, transaction: t})
    }

    static async getAndLock(reservationInventoryId: number, transaction) {
        const rI:ReservationInventory = await this.findByPk(reservationInventoryId, {transaction: transaction, lock: transaction.LOCK});
        return rI;
    }
}
