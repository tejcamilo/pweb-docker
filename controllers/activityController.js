import { ActivityModel } from "../models/activityModel.js";
import { groupModel } from "../models/groupModel.js";
import fs from 'fs';
import multer from 'multer';
import path from 'path';

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

export const crearActividad = async (req, res) => {
    upload(req, res, async function(err) {
        if (err) {
            console.log(err.message);
            const grupos = await groupModel.find();
            return res.render('Actividades/crearActividad', {
                nombre: req.body.nombre || "",
                grupo: req.body.grupo || "",
                fecha: req.body.fecha || "",
                ubicacion: req.body.ubicacion || "",
                resultado: req.body.resultado || "",
                imagen: null,
                mensajeAlerta: err.message,
                grupos: grupos,
            });
        } else{
            if (!req.body.nombre || !req.body.grupo || req.body.grupo === "0" || !req.body.fecha) {
                const mensajeAlerta = "Por favor, completa todos los campos obligatorios, marcados con *.";
                const grupos = await groupModel.find();
                return res.render("Actividades/crearActividad", {
                    nombre: req.body.nombre || "",
                    grupo: req.body.grupo || "",
                    fecha: req.body.fecha || "",
                    ubicacion: req.body.ubicacion || "",
                    resultado: req.body.resultado || "",
                    imagen: null,
                    mensajeAlerta: mensajeAlerta,
                    grupos: grupos
                });
            }
            try{
                const data = req.body;
                console.log(data);
                if(req.file != undefined){
                    console.log(req.file);
                    const imagen = saveImage(req.file);
                    data.imagen = imagen;
                }
                await ActivityModel.create(data);
                const actividades = await ActivityModel.find();
                res.render('Actividades/consultarActividades', {actividades: actividades, titulo: "Consultar"});
                // res.status(200).json(actividades);
                console.log("Actividad creada correctamente");
            }
            catch(error){
                console.log(error);
                res.status(400).json({mensaje: error.message, actividades});
            }
        }
    });
}

export const consultarActividades = async (req, res) => {
    try{
        const actividades = await ActivityModel.find();
        res.render('Actividades/consultarActividades', {actividades: actividades, titulo: "Consultar"});
        console.log("Actividades obtenidas correctamente");
    }
    catch(error){
        // res.status(400).json({mensaje: error.message});
        console.log("Error al obtener las actividades");
    }
}

export const consultarActividadesTitulo = async (req, res) => {
    try{
        const titulo = req.params.titulo;
        const actividades = await ActivityModel.find();
        res.render('Actividades/consultarActividades', {actividades: actividades, titulo: titulo});
        console.log("Actividades obtenidas correctamente");
    }
    catch(error){
        // res.status(400).json({mensaje: error.message});
        console.log("Error al obtener las actividades");
    }
}

export const obtenerActividadPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const actividad = await ActivityModel.findById(id);
        // res.status(200).json(actividad);
        res.render('Actividades/consultarActividadParticular', {actividad: actividad});
        console.log("Actividad obtenida correctamente");
        
    } catch (error) {
        // res.status(400).json({mensaje: error.message});
        console.log("Error al obtener la actividad");
    }
}

export const actualizarActividad = async (req, res) => {
    upload(req, res, async function(err) {
        if (err) {
            console.log(err.message);
            const grupos = await groupModel.find();
            const actividad = await ActivityModel.findById(req.body.idActividad);
            return res.render('Actividades/editarActividad', {
                actividad: actividad,
                mensajeAlerta: err.message,
                grupos: grupos,
            });
        } else{
            const actividad = await ActivityModel.findById(req.body.idActividad);
            if (!req.body.nombre || !req.body.grupo || req.body.grupo === "0" || !req.body.fecha) {
                const mensajeAlerta = "Por favor, completa todos los campos obligatorios, marcados con *.";
                const grupos = await groupModel.find();
                return res.render("Actividades/editarActividad", {
                    actividad: actividad,
                    mensajeAlerta: mensajeAlerta,
                    grupos: grupos
                });
            }
            try {
                const actividadb = await ActivityModel.findById(req.body.idActividad);
                const dataUpdated = req.body;
                if (req.file) {
                    console.log("Nueva imagen subida:", req.file);
                    const newImagePath = saveImage(req.file);
                    if (actividadb.imagen) {
                        deleteImage(actividadb.imagen); // Eliminar la imagen existente
                    }
                    dataUpdated.imagen = newImagePath;
                }
                await ActivityModel.updateOne({_id: req.body.idActividad}, {
                    nombre: dataUpdated.nombre, 
                    grupo: dataUpdated.grupo, 
                    fecha: dataUpdated.fecha, 
                    ubicacion: dataUpdated.ubicacion,
                    resultado: dataUpdated.resultado,
                    imagen: dataUpdated.imagen || actividadb.imagen,
                });
                const actividad = await ActivityModel.findById(req.body.idActividad);
                res.render('Actividades/consultarActividadParticular', {actividad: actividad});
                // res.status(200).json(actividades);
                console.log("Actividad actualizada correctamente");
        
            } catch (error) {
                // res.status(400).json({mensaje: error.message});
                console.log(error.message);
            }
            
        }
    });
}

// Cambiando eliminar por inhabilitar
export const inhabilitarActividad = async (req, res) => {
    try{
        await ActivityModel.updateOne({_id: req.params.id}, {estado: false});
        const actividades = await ActivityModel.find();
        res.render('Actividades/consultarActividades', {actividades: actividades, titulo: "Consultar"});
        console.log("Actividad inhabilitada correctamente");
    } catch(error){
        // res.status(400).json({mensaje: error.message});
        console.log("Error al inhabilitar la actividad");
    }
}

// Creando función habilitar para deshacer la inhabilitación
export const habilitarActividad = async (req, res) => {
    try{
        await ActivityModel.updateOne({_id: req.params.id}, {estado: true});
        const actividades = await ActivityModel.find();
        res.render('Actividades/consultarActividades', {actividades: actividades, titulo: "Consultar"});
        console.log("Actividad habilitada correctamente");
    } catch(error){
        // res.status(400).json({mensaje: error.message});
        console.log("Error al habilitar la actividad");
    }
}

export const formularioRegistroActividad = async (req, res) => {
    const grupos = await groupModel.find();
    console.log(grupos);
    res.render('Actividades/crearActividad', {nombre: null, grupo: null, fecha: null, ubicacion: null, resultado: null, imagen: null, mensajeAlerta: null, grupos: grupos});
}

export const formularioActualizarActividad = async (req, res) => {
    try {
        const id = req.params.id;
        const grupos = await groupModel.find();
        const actividad = await ActivityModel.findById(id);
        res.render('Actividades/editarActividad', {actividad: actividad, mensajeAlerta: null, grupos: grupos});
    } catch (error) {
        // res.status(400).json({mensaje: error.message});
        console.log(error);
    }
}

// Subir imagen usando multer
function saveImage(file) {
    const date = Date.now();
    const ext = path.extname(file.originalname);
    let newPath = `assets/uploads/${date}${ext}`;
    console.log(newPath);
    console.log(file.path);
    fs.renameSync(file.path, newPath);
    newPath = `/uploads/${date}${ext}`;
    return newPath;
}

const deleteImage = (imagePath) => {
    const pathImage = `assets${imagePath}`;
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage); // Eliminar el archivo del sistema
    }
};

export const subirImagen = (req, res) => {
    var upload = multer({
        dest: 'assets/uploads/',
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true);
            } else {
                return cb({message: 'Invalid mime type'}, null);
            }
        }
    }).single('imagen');

    upload(req, res, async function(err) {
        if (err) {
            console.log(err);
            return res.status(400).json({mensaje: err.message});
        } else{
            try{
                const data = req.body;
                console.log(data);
                if(req.file != undefined){
                    console.log(req.file);
                    const imagen = saveImage(req.file);
                    data.imagen = imagen;
                }
                await ActivityModel.create(data);
                const actividades = await ActivityModel.find();
                // res.render('Actividades/consultarActividades', {actividades: actividades, titulo: "Consultar"});
                res.status(200).json(actividades);
                console.log("Actividad creada correctamente");
            }
            catch(error){
                console.log(error);
                res.status(400).json({mensaje: error.message, actividades});
            }
        }
    });
}