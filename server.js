import express, { json } from "express";
import session from 'express-session';
import { __dirname } from "./util/__dirname.js";
import { join } from "path";
import crypto from 'crypto';
import multer from 'multer';

import { connectDB } from "./config/database.js";
import { consultarGrupos, crearGrupo, obtenerGrupoPorId, actualizarGrupo, inhabilitarGrupo, habilitarGrupo, formularioActualizarGrupo, formularioRegistroGrupo, consultarGruposTitulo, index, integrantes, eliminarIntegrante } from "./controllers/groupController.js";
import { consultarActividades, crearActividad, obtenerActividadPorId, actualizarActividad, inhabilitarActividad, habilitarActividad, formularioActualizarActividad, formularioRegistroActividad, consultarActividadesTitulo, subirImagen} from "./controllers/activityController.js";
import * as userController from "./controllers/userController.js";

const server = express();

// ---------- Configuración de multer ----------
const upload = multer({ dest: 'assets/uploads/',
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            return cb(new Error('Invalid mime type'));
        }
    }
 });

// ---------- Conexion a la base de datos ----------
connectDB().then(() => { console.log('Base de datos conectada'); }).catch((error) => {
    console.log(error);
});

// Generate a strong secret key
const sessionSecret = crypto.randomBytes(32).toString('hex');

// Middleware to handle sessions
server.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true
}));

// Middleware to parse request bodies
server.use(express.urlencoded({ extended: true }));
server.use(express.static('assets')); //en el ejemplo de clase usan public, pero nuestro directorio se llama assets
server.use(json());

// Middleware to make the username available to all templates
server.use((req, res, next) => {
    res.locals.username = req.session.user ? req.session.user.nombre : null;
    res.locals.isAdmin = req.session.user ? req.session.user.isAdmin : null;
    next();
});

function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    } else {
        res.redirect('/');
    }
}

// Routes that do not require authentication
server.get('/', userController.iniciarSesion);
server.get('/recuperarCuenta', userController.recuperarCuenta);
server.post('/login', userController.login);
server.post('/actividades/subirImagen', subirImagen);
server.post('/grupos/subirImagen', subirImagen)


// Apply the isAuthenticated middleware to all other routes
server.use(isAuthenticated);

// Routes that require authentication

// ---------- Rutas ----------
// Meter aquí las rutas para ejecutar las funciones de los controladores

server.get('/actividades', consultarActividades);
server.post('/actividades/crear', crearActividad);
server.get('/actividades/crear', formularioRegistroActividad);
server.get('/actividades/actividad/:id', obtenerActividadPorId);
server.post('/actividades/actualizar', actualizarActividad);
server.get('/actividades/actualizar/:id', formularioActualizarActividad);
server.post('/actividades/inhabilitar/:id', inhabilitarActividad);
server.post('/actividades/habilitar/:id', habilitarActividad);
server.get('/actividades/:titulo', consultarActividadesTitulo);
// server.post('/actividades/imagen', upload.single('imagen'), guardarImagenActividad);

server.post('/usuarios/crear', userController.crearUsuario);
server.get('/usuarios/crear', userController.renderCrearUsuario);
server.get('/usuarios/:id', userController.obtenerUsuario);
server.post('/usuarios/actualizar', userController.actualizarUsuario);
server.get('/usuarios', userController.getUsuarios);

server.get('/grupos', consultarGrupos);
server.post('/grupos/eliminarintegrante/:idgrupo/:idintegrante', eliminarIntegrante)
server.get('/grupos/verIntegrantes/:id', integrantes);
server.post('/grupos/crear', crearGrupo);
server.get('/grupos/crear', formularioRegistroGrupo);
server.get('/grupos/grupo/:id', obtenerGrupoPorId);
server.post('/grupos/actualizar', actualizarGrupo);
server.get('/grupos/actualizar/:id', formularioActualizarGrupo);
server.post('/grupos/inhabilitar/:id', inhabilitarGrupo);
server.post('/grupos/habilitar/:id', habilitarGrupo);
server.get('/grupos/:titulo', consultarGruposTitulo);

server.get('/index', index);

// Logout route
server.get('/logout', userController.logout);

// ---------- Configuración del motor de plantillas ----------
server.set('view engine', 'ejs');
server.set('views', join(__dirname, 'views'));

// ---------- Método para manejar solicitudes DELETE desde un formulario (method-override) ----------
import methodOverride from "method-override";
server.use(methodOverride("_method"));

server.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));