import { groupModel } from "../models/groupModel.js";
import { UserModel } from "../models/userModel.js";
import multer from 'multer';
import fs from 'fs';

var upload = multer({
    dest: 'assets/uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            return cb({message: 'Ups! Subiste un archivo no permitido. Por favor, selecciona una imagen'}, null);
        }
    }
}).single('imagen');

export const crearGrupo = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error("Error al subir la imagen:", err.message);
            return res.status(400).render('Grupos/crearGrupoEsp', { mensajeAlerta: err.message });
        }

        try {
            const { nombre, categoria, diaspractica, ubicacion, integrantes } = req.body;

            // Ruta de la imagen subida
            const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null;

            // Asegúrate de que `integrantes` sea un arreglo
            const integrantesIds = Array.isArray(integrantes) ? integrantes : [integrantes];

            // Crear el grupo
            const nuevoGrupo = await groupModel.create({
                nombre,
                categoria,
                diaspractica,
                ubicacion,
                integrantes: integrantesIds,
                imagen: imagenUrl // Guarda la URL de la imagen en el modelo
            });

            console.log("Grupo creado correctamente:", nuevoGrupo);

            // Recuperar todos los grupos y renderizar la vista
            const grupos = await groupModel.find().populate('integrantes');
            res.render('Grupos/consultarGruposGen', { grupos, titulo: "Consultar" });
        } catch (error) {
            console.error("Error al crear el grupo:", error.message);
            res.status(400).render('Grupos/crearGrupoEsp', { mensajeAlerta: error.message });
        }
    });
};

export const consultarGrupos = async (req, res) => {
    try{
        const grupos = await groupModel.find();
        res.render('Grupos/consultarGruposGen', {grupos: grupos, titulo: "Consultar"});
        console.log("Grupo obtenido correctamente");
    }
    catch(error){
        // res.status(400).json({mensaje: error.message});
        console.log("Error al obtener el grupo");
    }
}

export const consultarGruposTitulo = async (req, res) => {
    try{
        const titulo = req.params.titulo;
        const grupos = await groupModel.find();
        res.render('Grupos/consultarGruposGen', {grupos: grupos, titulo: titulo});
        console.log("Grupos obtenidos correctamente");
    }
    catch(error){
        // res.status(400).json({mensaje: error.message});
        console.log("Error al obtener los grupos");
    }
}

export const obtenerGrupoPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const grupo = await groupModel.findById(id).populate({ path: 'integrantes', select: 'nombre' });
        
        if (!grupo) {
            return res.status(404).send('Grupo no encontrado');
        }

        res.render('Grupos/consultarGrupoEsp', { grupo });
    } catch (error) {
        console.error("Error al obtener el grupo:", error.message);
        res.status(400).send('Error al obtener el grupo');
    }
};


export const actualizarGrupo = async (req, res) => {
    upload(req, res, async function (err) {
        if (err) {
            console.error("Error al subir la imagen:", err.message);
            return res.status(400).render('Grupos/editarGrupo', {
                grupo: await groupModel.findById(req.body.idGrupo),
                mensajeAlerta: err.message
            });
        }

        try {
            const idGrupo = req.body.idGrupo;
            const dataUpdated = req.body;

            const grupoExistente = await groupModel.findById(idGrupo);

            // Manejo de la imagen
            if (req.file) {
                // Nueva imagen subida
                console.log("Nueva imagen subida:", req.file);
                const newImagePath = `/uploads/${req.file.filename}`;

                // Eliminar la imagen anterior si existe
                if (grupoExistente.imagen) {
                    const oldImagePath = `assets${grupoExistente.imagen}`;
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }

                dataUpdated.imagen = newImagePath; // Actualizar la imagen con la nueva
            } else {
                dataUpdated.imagen = grupoExistente.imagen; // Mantener la imagen existente
            }

            // Actualizar los datos del grupo
            const grupoActualizado = await groupModel.findByIdAndUpdate(idGrupo, dataUpdated, { new: true });

            if (!grupoActualizado) {
                return res.status(404).json({ mensaje: "Grupo no encontrado" });
            }

            console.log("Grupo actualizado correctamente:", grupoActualizado);
            res.render('Grupos/consultarGrupoEsp', { grupo: grupoActualizado });
        } catch (error) {
            console.error("Error al actualizar el grupo:", error.message);
            res.status(400).json({ mensaje: error.message });
        }
    });
};



export const inhabilitarGrupo = async (req, res) => {
    try{
        await groupModel.updateOne({_id: req.params.id}, {estado: false});
        const grupos = await groupModel.find();
        res.render('Grupos/consultarGruposGen', {grupos: grupos, titulo: "Consultar"});
        console.log("Grupo inhabilitado correctamente");
    } catch(error){
        // res.status(400).json({mensaje: error.message});
        console.log("Error al inhabilitar el grupo");
    }
}

export const habilitarGrupo = async (req, res) => {
    try{
        await groupModel.updateOne({_id: req.params.id}, {estado: true});
        const grupos = await groupModel.find();
        res.render('Grupos/consultarGruposGen', {grupos: grupos, titulo: "Consultar"});
        console.log("Grupo habilitado correctamente");
    } catch(error){
        // res.status(400).json({mensaje: error.message});
        console.log("Error al habilitar el grupo");
    }
}

export const formularioRegistroGrupo = async (req, res) => {
    try {
        const usuarios = await UserModel.find();
        res.render('Grupos/crearGrupoEsp', {
            usuarios: usuarios,
            imagen: null // Inicializa imagen como null
        });
    } catch (error) {
        res.status(400).json({ mensaje: error.message });
    }
};


export const formularioActualizarGrupo = async (req, res) => {
    try {
        const id = req.params.id;
        const grupo = await groupModel.findById(id);
        const usuarios = await UserModel.find();
        res.render('Grupos/editarGrupo', {grupo: grupo, usuarios: usuarios});
    } catch (error) {
        // res.status(400).json({mensaje: error.message});
        console.log(error);
    }
}

export const index = (req, res) => {
    res.render('indexdos');
}

export const integrantes = async (req, res) => {
    const grupo = await groupModel.findById(req.params.id).populate({path: 'integrantes'})
    console.log(grupo)
    res.render('Grupos/consultarIntegrantesGrupo', {grupo: grupo});
}

export const eliminarIntegrante = async (req, res) => {
    try {
        const idGrupo = req.params.idgrupo;
        const idIntegrante = req.params.idintegrante;

        // Encuentra el grupo y actualiza la lista de integrantes
        const grupoActualizado = await groupModel.findByIdAndUpdate(
            idGrupo,
            { $pull: { integrantes: idIntegrante } }, // $pull elimina el integrante del arreglo
            { new: true } // Devuelve el documento actualizado
        ).populate({
            path: 'integrantes',
            select: 'nombre' // Opcional: Poblar los nombres de los integrantes restantes
        });

        if (!grupoActualizado) {
            return res.status(404).json({ mensaje: "Grupo no encontrado" });
        }

        console.log("Integrante eliminado correctamente:", idIntegrante);
        res.render('Grupos/consultarGrupoEsp', { grupo: grupoActualizado });

    } catch (error) {
        console.error("Error al eliminar el integrante:", error.message);
        res.status(400).json({ mensaje: error.message });
    }
};
