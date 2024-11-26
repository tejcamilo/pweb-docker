import { Schema, model } from "mongoose";

const userSchema = new Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    correo: { type: String, required: true },
    ids: { type: String, required: true },
    estado: { type: Boolean, default: true, required: true }, // habilidado o deshabilitado
    imagen: { type: String }, // Agregamos un campo imagen para almacenar la URL de la imagen
    password: { type: String }, // Campo para almacenar la contraseña hasheada
    isAdmin: { type: Boolean, default: false,  } // Campo para identificar si el usuario es administrador
});

const UserModel = model('usuarios', userSchema);

export { UserModel };