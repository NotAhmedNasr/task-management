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
import { AuthProviderType } from '../types';

@Table({
  tableName: 'provider_attributes',
  timestamps: true,
})
export class AuthProviderAttributes extends Model {
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

  @AllowNull(false)
  @Column({
    type: DataType.STRING(300),
  })
  identifier: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING(300),
  })
  email: string;

  @Column
  lastLoginAt: Date;

  @AllowNull(false)
  @ForeignKey(() => UserAttributes)
  @Column
  userId: number;

  @BelongsTo(() => UserAttributes, 'userId')
  user: UserAttributes;
}
