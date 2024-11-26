import { connect } from 'mongoose';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/userModel.js'; // Ensure the path is correct

const mongoUrl = process.env.MONGO_URL || 'mongodb://mongo:27017/ur_deporte_cultura';

async function connectDB() {
    try {
        const respDB = await connect(mongoUrl);
        console.log('Base de datos conectada');

        // Check if admin user exists
        const adminUser = await UserModel.findOne({ correo: 'admin@example.com' });
        if (!adminUser) {
            // Create admin user if it doesn't exist
            const hashedPassword = await bcrypt.hash('admin', 10);
            const newAdminUser = new UserModel({
                nombre: 'Admin',
                apellido: 'User',
                correo: 'admin@example.com',
                ids: 'admin-id',
                password: hashedPassword,
                isAdmin: true,
            });

            await newAdminUser.save();
            console.log('Admin user created successfully');
        } else {
            console.log('Admin user already exists');
        }

        return respDB;
    } catch (error) {
        console.log(error);
    }
}

export { connectDB };