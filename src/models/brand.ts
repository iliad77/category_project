import { DataTypes, Sequelize, Model } from "sequelize";

class Brand extends Model {
    public id!: number;
    public name!: string;
}

function initBrand(sequelize: Sequelize) {
    Brand.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            name: { type: DataTypes.STRING, allowNull: false },
        },
        { sequelize, modelName: "brand", tableName: "brand", timestamps: false }
    );
    return Brand;
}

export { initBrand, Brand };
