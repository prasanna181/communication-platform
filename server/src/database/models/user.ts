import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import bcrypt from "bcrypt";
import sequelize from "./db";

export enum USER_ROLES {
  ADMIN = "admin",
  USER = "user",
}

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: number;
  declare name: string;
  declare firstName: string | null;
  declare lastName: string | null;
  declare email: string;
  declare password_hash: string;
  declare role: string;
  declare mobile: string;
  declare otpVerified: boolean;
  declare lastLogin: CreationOptional<Date>;
  declare location: string;
  declare state: string;
  declare district: string;
  declare cityOrVillage: string;
  declare pinCode: string;
  declare profilePicture: string;
  declare bio: string;
  declare isActive: boolean;
  declare createdAt: CreationOptional<Date>;
  declare passwordUpdatedAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password_hash);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    mobile: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    otpVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    passwordUpdatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    district: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cityOrVillage: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pinCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeCreate: async (user: User) => {
        if (user.password_hash) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
          user.passwordUpdatedAt = new Date();
        }
      },

      beforeUpdate: async (user: User) => {
        if (user.changed("password_hash")) {
          user.password_hash = await bcrypt.hash(user.password_hash, 10);
          user.passwordUpdatedAt = new Date();
        }
      },
    },
  }
);

export default User;
