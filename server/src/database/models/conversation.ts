import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";

export enum CONVERSATION_TYPE {
  SINGLE = "single",
  GROUP = "group",
}

class Conversation extends Model<
  InferAttributes<Conversation>,
  InferCreationAttributes<Conversation>
> {
  declare id: number;
  declare type: string;
  declare roomName: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Conversation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      defaultValue: CONVERSATION_TYPE.SINGLE,
      allowNull: false,
    },
    roomName: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: "conversations",
    timestamps: true,
  }
);

export default Conversation;
