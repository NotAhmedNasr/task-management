import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { Task } from './task.model';

export interface BoardAttributes {
  id?: string;
  name?: string;
  personal?: boolean;
  createdById?: number;
  createdBy?: UserAttributes;
}

@Table({
  tableName: 'boards',
  timestamps: true,
})
export class Board extends Model<BoardAttributes, Omit<BoardAttributes, 'id'>> {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @AllowNull(true)
  @Column(DataType.STRING(200))
  name: string;

  @Default(true)
  @Column(DataType.BOOLEAN)
  personal: boolean;

  @AllowNull(false)
  @ForeignKey(() => UserAttributes)
  @Column
  createdById: number;

  @BelongsTo(() => UserAttributes, 'createdById')
  createdBy: UserAttributes;

  @HasMany(() => Task, { onDelete: 'CASCADE' })
  tasks: Task[];
}
