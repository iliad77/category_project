import { DataTypes, Sequelize, Model } from "sequelize";

class Files extends Model {
    public id!: number;
    public userID!: number;
    public file!: string;
}

function initFiles(sequelize: Sequelize) {
    Files.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            userID: { type: DataTypes.INTEGER, allowNull: false },
            file: { type: DataTypes.STRING, allowNull: false },
        },
        { sequelize, modelName: "files", tableName: "files", timestamps: false }
    );
    return Files;
}

export { initFiles, Files };
