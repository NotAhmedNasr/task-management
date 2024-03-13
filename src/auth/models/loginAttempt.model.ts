import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { UserAttributes } from 'src/user/models/userAttributes.model';
import { AuthProviderType, LoginFailureReason } from '../types';

@Table({
  tableName: 'login_attempt',
  createdAt: 'time',
  updatedAt: false,
})
export class LoginAttempt extends Model {
  // attributes
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM,
    values: Object.values(AuthProviderType),
  })
  type: AuthProviderType;

  @AllowNull(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  success: boolean;

  @AllowNull(true)
  @Column({
    type: DataType.INET,
  })
  address: string;

  @AllowNull(true)
  @Column({
    type: DataType.ENUM,
    values: Object.values(LoginFailureReason),
  })
  failureReason: string;

  @AllowNull(false)
  @ForeignKey(() => UserAttributes)
  @Column
  userId: number;

  @BelongsTo(() => UserAttributes, 'userId')
  user: UserAttributes;
}
