import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/sequelize';

interface PropertyAttributes {
  id: number;
  name: string;
}

class Property extends Model<PropertyAttributes> implements PropertyAttributes {
  public id!: number;
  public name!: string;
}

Property.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Property',
  }
);

export default Property;
