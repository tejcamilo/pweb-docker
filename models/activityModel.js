import { Schema, model} from "mongoose";

const activitySchema = new Schema({
    nombre: {type: String},
    grupo: {type: String},
    fecha: {type: String},
    ubicacion: {type: String},
    resultado: {type: String},
    estado: { type: Boolean, default: true, required: true }, // habilidado (true) o deshabilitado (false)
    imagen: {type: String} // Agregamos un campo imagen para almacenar la URL de la imagen
    // La imagen se va a subir con multer y se va a guardar en la carpeta uploads
    // La URL guardada en la base de datos va a ser la ubicación de la imagen en el servidor
})

const ActivityModel = model('actividades', activitySchema);

export {ActivityModel};