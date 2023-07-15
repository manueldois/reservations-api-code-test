import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/sequelize';

interface GuestAttributes {
    id: number;
    name: string;
    phoneNumber: string;
}

class Guest extends Model<GuestAttributes> implements GuestAttributes {
    public id!: number;
    public name!: string;
    public phoneNumber!: string;
}

Guest.init(
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
        phoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Guest',
    }
);

export default Guest;
