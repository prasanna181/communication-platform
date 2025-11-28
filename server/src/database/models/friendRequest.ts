import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import User from "./user";

export enum FREINDSHIP_REQUEST_STATUS {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

class FriendRequest extends Model<
  InferAttributes<FriendRequest>,
  InferCreationAttributes<FriendRequest>
> {
  declare id: number;
  declare userId: number;
  declare friendId: number;
  declare status: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

FriendRequest.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    friendId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },

    status: {
      type: DataTypes.STRING,
      defaultValue: FREINDSHIP_REQUEST_STATUS.PENDING,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "friendRequests",
    timestamps: true,
  }
);

// Associations

User.hasMany(FriendRequest, {
  foreignKey: "friendId",
  as: "friendRequests",
});

FriendRequest.belongsTo(User, {
  foreignKey: "friendId",
  as: "friends",
});

export default FriendRequest;
