import { Schema, model} from "mongoose";

const groupSchema = new Schema({
    nombre: {type: String},
    categoria: {type: String},
    diaspractica: {type: String},
    ubicacion: {type: String},
    integrantes: [
        { 
          type: Schema.Types.ObjectId, 
          ref: 'usuarios' // Referencia al modelo Usuario
        }
      ],
    imagen: {type: String},
    estado: { type: Boolean, default: true, required: true }, 
})

const groupModel = model('grupos', groupSchema);

export {groupModel};