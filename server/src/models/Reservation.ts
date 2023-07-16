import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../services/sequelize';
import Property from './Property';

interface ReservationAttributes {
    id: number;
    startDate: Date;
    endDate: Date;
}

class Reservation extends Model<ReservationAttributes> implements ReservationAttributes {
    public id!: number;
    public startDate!: Date;
    public endDate!: Date;
}

Reservation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Reservation',
    }
);

Reservation.belongsTo(Property);

export default Reservation;
