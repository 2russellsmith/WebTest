import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey, Table,
  UpdatedAt
} from 'sequelize-typescript'

@Table({ tableName: 'restaurants' })
export class Restaurant extends Model<Restaurant> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @Column({allowNull: false})
  name: string

  @Column({allowNull: false})
  address: string

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
