import { Model, DataTypes, Sequelize } from "sequelize";

class User extends Model {
    public id!: number;
    public username!: string;
    public profile_pic!: string;
    public email!: string;
    public password!: string;
    public status!: number;
}
function initUser(sequelize: Sequelize): typeof User {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            profile_pic: {
                type: DataTypes.STRING,
                references: { model: "files", key: "id" },
            },
            email: { type: DataTypes.STRING },
            password: { type: DataTypes.STRING, allowNull: false },
            status: { type: DataTypes.INTEGER, defaultValue: 1 },
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            timestamps: false,
        }
    );
    return User;
}

export { User, initUser };
