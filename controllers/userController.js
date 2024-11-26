import bcrypt from 'bcrypt';
import { UserModel } from '../models/userModel.js';
import multer from 'multer';

// Configure storage options
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'assets/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Configure file filtering
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo inválido'), false);
    }
};

// Initialize Multer with storage and file filter
const upload = multer({ storage: storage, fileFilter: fileFilter });

export const crearUsuario = async (req, res) => {
    upload.single('imagen')(req, res, async function(err) {
        if (err) {
            console.log(err.message);
            return res.status(404).render('Usuarios/crearUsuario', {
                nombre: req.body.nombre || "",
                apellido: req.body.apellido || "",
                correo: req.body.correo || "",
                ids: req.body.ids || "",
                estado: req.body.estado || true,
                imagen: null,
                mensajeAlerta: err.message,
            });
        } else {
            try {
                const data = req.body;
                console.log(data);
                if (req.file) {
                    data.imagen = req.file.path;
                }
                await UserModel.create(data);
                res.redirect('/usuarios');
                console.log("Usuario creado correctamente");
            } catch (error) {
                console.log(error);
                res.status(404).render('Usuarios/crearUsuario', {
                    nombre: req.body.nombre || "",
                    apellido: req.body.apellido || "",
                    correo: req.body.correo || "",
                    ids: req.body.ids || "",
                    estado: req.body.estado || true,
                    imagen: null,
                    mensajeAlerta: "Error al crear el usuario",
                });
            }
        }
    });
}

export const renderCrearUsuario = (req, res) => {
    try {
        res.render('Usuarios/crearUsuario');
    } catch (error) {
        console.log(error);
    }
}

export const obtenerUsuario = async (req, res) => {
    try {
        const id = req.params.id;
        const userId = await UserModel.findById(id);
        console.log('Usuario obtenido:', userId); // Debugging statement    
        res.render('Usuarios/consultarUsuario', { usuario: userId });
        console.log("Usuario obtenido correctamente"); 
    } catch (error) {
        console.log("Error al obtener usuario");
    }
}


export const actualizarUsuario = async (req, res) => {
    upload.single('imagen')(req, res, async function(err) {
        if (err) {
            console.log('Multer error:', err.message);
            const usuario = await UserModel.findById(req.body.idUsuario);
            return res.status(404).render('Usuarios/consultarUsuario', {
                usuario: usuario,
                mensajeAlerta: err.message,
            });
        } else {
            try {
                const { idUsuario, nombre, apellido, correo, ids, estado } = req.body;
                console.log('Request body:', req.body); // Debugging statement

                // Check if the user exists before updating
                const userExists = await UserModel.findById(idUsuario);
                if (!userExists) {
                    console.log('User not found');
                    return res.status(404).render('Usuarios/consultarUsuario', {
                        usuario: req.body,
                        mensajeAlerta: 'User not found',
                    });
                }

                // Build the update object conditionally
                const updateData = {
                    ...(nombre && { nombre }),
                    ...(apellido && { apellido }),
                    ...(correo && { correo }),
                    ...(ids && { ids }),
                    ...(estado !== undefined && { estado }) // Conditionally include estado
                };

                if (req.file) {
                    updateData.imagen = req.file.path;
                }

                const updateResult = await UserModel.updateOne(
                    { _id: idUsuario },
                    { $set: updateData }
                );

                console.log('Update result:', updateResult); // Debugging statement

                if (updateResult.acknowledged === false) {
                    console.log('Update not acknowledged');
                    return res.status(500).render('Usuarios/consultarUsuario', {
                        usuario: req.body,
                        mensajeAlerta: 'Update not acknowledged',
                    });
                }

                if (updateResult.nModified === 0) {
                    console.log('No documents were updated');
                }

                console.log('Usuario modificado correctamente');
                res.redirect('/usuarios'); // Redirect to the desired page after successful update
            } catch (error) {
                console.log('Error al modificar usuario:', error.message);
                const usuario = await UserModel.findById(req.body.idUsuario);
                res.status(400).render('Usuarios/consultarUsuario', {
                    usuario: usuario,
                    mensajeAlerta: error.message,
                });
            }
        }
    });
};

export const getUsuarios = async (req, res) => {
    try {
        const data = await UserModel.find();
        res.render('Usuarios/usuarios', { usuarios: data });
    } catch (error) {
        console.log(error);
    }
}

export const iniciarSesion = async (req, res) => {
    try {
        res.render('Usuarios/iniciarSesion');
    } catch (error) {
        console.log(error);
    }
}

export const recuperarCuenta = async (req, res) => {
    try {
        res.render('Usuarios/recuperarCuenta');
    } catch (error) {
        console.log(error);
    }
}

export const login = async (req, res) => {
    try {
        const { correo, password } = req.body;
        console.log('POST /login');
        console.log('Request body:', req.body); // Debugging statement  

        const user = await UserModel.findOne({ correo, isAdmin: true });
        if (user) {
            console.log('User found:', user); // Debugging statement
            console.log('Plain text password:', password); // Debugging statement
            console.log('Hashed password from DB:', user.password); // Debugging statement

            const isMatch = await bcrypt.compare(password, user.password);
            console.log('Password match:', isMatch); // Debugging statement

            if (isMatch) {
                // Set the session
                req.session.user = { 
                    nombre: user.nombre, 
                    apellido: user.apellido, 
                    correo: user.correo, 
                    isAdmin: user.isAdmin 
                };
                res.redirect('/usuarios');
            } else {
                res.render('Usuarios/iniciarSesion', { error: true });
            }
        } else {
            res.render('Usuarios/iniciarSesion', { error: true });
        }
    } catch (error) {   
        console.log(error);
    }
}

export const logout = async (req, res) => {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error);
    }
}