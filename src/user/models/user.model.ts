import * as bcrypt from 'bcrypt';
import {
  Table,
  Model,
  Column,
  PrimaryKey,
  AutoIncrement,
  NotNull,
  Unique,
  DataType,
  AllowNull,
  IsEmail,
  BeforeCreate,
} from 'sequelize-typescript';

@Table({
  tableName: 'user',
  timestamps: true,
})
export class User extends Model {
  // attributes
  @Column
  @PrimaryKey
  @Unique
  @NotNull
  @AutoIncrement
  id: number;

  @Column({
    type: DataType.STRING(100),
  })
  @NotNull
  @Unique
  username: string;

  @Column({
    type: DataType.STRING(300),
  })
  @AllowNull
  password: string;

  @Column({
    type: DataType.STRING(300),
  })
  @NotNull
  @Unique
  @IsEmail
  email: string;

  @Column({
    type: DataType.STRING(100),
  })
  @NotNull
  firstName: string;

  @Column({
    type: DataType.STRING(100),
  })
  @NotNull
  lastName: string;

  // hooks
  @BeforeCreate
  async hashPassword(instance: User) {
    instance.password = await bcrypt.hash(instance.password, 3);
  }

  // instance methods
  validatePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }

  sanitize() {
    if (this.password) {
      delete this.password;
    }
  }
}
