import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/sequelize';
import Guest from './Guest';
import Property from './Property';

interface MessageAttributes {
  id: number;
  body: string;
}

class Message extends Model<MessageAttributes> implements MessageAttributes {
  public id!: number;
  public body!: string;
}

Message.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    body: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Message',
  }
);

Message.belongsTo(Guest, { foreignKey: 'id', as: 'sender' });
Message.belongsTo(Guest, { foreignKey: 'id', as: 'receiver' });

export default Message;
