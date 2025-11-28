import {
  Model,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import sequelize from "./db";
import Conversation from "./conversation";
import User from "./user";

class ConversationMember extends Model<
  InferAttributes<ConversationMember>,
  InferCreationAttributes<ConversationMember>
> {
  declare id: number;
  declare conversationId: number;
  declare userId: number;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

ConversationMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    conversationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Conversation,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id",
      },
      onDelete: "CASCADE",
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
    tableName: "conversationMembers",
    timestamps: true,
  }
);

// Associations

Conversation.hasMany(ConversationMember, {
  foreignKey: "conversationId",
  as: "members",
});

export default ConversationMember;
