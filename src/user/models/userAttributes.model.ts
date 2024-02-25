import * as bcrypt from 'bcrypt';
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  Unique,
  DataType,
  AllowNull,
  IsEmail,
  BeforeCreate,
  Default,
  DefaultScope,
  Scopes,
  HasMany,
} from 'sequelize-typescript';
import { AuthProviderAttributes } from 'src/auth/models/authProviderAttributes.model';

@DefaultScope(() => ({
  attributes: [
    'id',
    'username',
    'email',
    'firstName',
    'lastName',
    'emailVerified',
    'blocked',
  ],
}))
@Scopes(() => ({
  login: {},
}))
@Table({
  tableName: 'user_attributes',
  timestamps: true,
})
export class UserAttributes extends Model {
  // attributes
  @AutoIncrement
  @PrimaryKey
  @Column
  id: number;

  @AllowNull(false)
  @Unique
  @Column({
    type: DataType.STRING(100),
  })
  username: string;

  @AllowNull
  @Column({
    type: DataType.STRING(300),
  })
  password: string;

  @AllowNull(false)
  @Unique
  @IsEmail
  @Column({
    type: DataType.STRING(300),
  })
  email: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  firstName: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
  })
  lastName: string;

  @Default(false)
  @Column(DataType.BOOLEAN)
  emailVerified: boolean;

  @Default(false)
  @Column(DataType.BOOLEAN)
  blocked: boolean;

  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  confirmationToken: string;

  @HasMany(() => AuthProviderAttributes, { onDelete: 'CASCADE' })
  authProviders: AuthProviderAttributes[];

  // hooks
  @BeforeCreate
  static async hashPassword(instance: UserAttributes) {
    if (instance.password) {
      instance.password = await bcrypt.hash(instance.password, 3);
    }
  }

  // instance methods
  async validatePassword(password: string) {
    if (!this.password) {
      return false;
    }
    return bcrypt.compare(password, this.password);
  }

  public toJSON() {
    const result = super.toJSON();
    delete result.password;
    return result;
  }
}
