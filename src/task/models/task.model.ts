import {
  AllowNull,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { TaskStatus } from '../types';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { BelongsToGetAssociationMixin } from 'sequelize';

interface TaskAttributes {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueAt: Date;
  createdById: number;
  createdBy: UserAttributes;
  assigneeId: number;
  assignee: UserAttributes;
}

@Table({
  tableName: 'tasks',
  timestamps: true,
})
export class Task extends Model<
  TaskAttributes,
  Omit<TaskAttributes, 'id' | 'status'>
> {
  @Default(DataType.UUIDV4)
  @PrimaryKey
  @Column(DataType.UUID)
  id: string;

  @AllowNull(false)
  @Column(DataType.STRING(300))
  title: string;

  @AllowNull(false)
  @Column(DataType.STRING(10000))
  description: string;

  @Default(TaskStatus.TODO)
  @Column({
    type: DataType.ENUM,
    values: Object.values(TaskStatus),
  })
  status: TaskStatus;

  @AllowNull(false)
  @Column(DataType.DATE)
  dueAt: Date;

  @AllowNull(false)
  @ForeignKey(() => UserAttributes)
  @Column
  createdById: number;

  @BelongsTo(() => UserAttributes, 'createdById')
  createdBy: UserAttributes;

  @AllowNull(false)
  @ForeignKey(() => UserAttributes)
  @Column
  assigneeId: number;

  @BelongsTo(() => UserAttributes, 'assigneeId')
  assignee: UserAttributes;

  declare getCreatedBy: BelongsToGetAssociationMixin<UserAttributes>;
  declare getAssignee: BelongsToGetAssociationMixin<UserAttributes>;
}
