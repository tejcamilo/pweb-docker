const sidebar = document.querySelector('#sidebar');
const menuCerrado = document.querySelector('#menuCerrado');
const menuAbierto = document.querySelector('#menuAbierto');
const sombra = document.querySelector('#sombra');

/* -------------------- USUARIOS --------------------*/
const usuarios = document.querySelector('#usuarios');
const crearUsuarios = document.querySelector('#crearUsuarios');
const verUsuarios = document.querySelector('#verUsuarios');
const opcionesUsuarios = [crearUsuarios, verUsuarios];

/* -------------------- GRUPOS --------------------*/
const grupos = document.querySelector('#grupos');
const crearGrupos = document.querySelector('#crearGrupos');
const verGrupos = document.querySelector('#verGrupos');
const editarGrupos = document.querySelector('#editarGrupos');
const inhabilitarGrupos = document.querySelector('#inhabilitarGrupos');
const opcionesGrupos = [crearGrupos, verGrupos, editarGrupos, inhabilitarGrupos];

/* -------------------- ACTIVIDADES --------------------*/
const actividades = document.querySelector('#actividades');
const crearActividades = document.querySelector('#crearActividades');
const verActividades = document.querySelector('#verActividades');
const editarActividades = document.querySelector('#editarActividades');
const inhabilitarActividades = document.querySelector('#inhabilitarActividades');
const opcionesActividades = [crearActividades, verActividades, editarActividades, inhabilitarActividades];

const opciones = [opcionesUsuarios, opcionesGrupos, opcionesActividades];

/* -------------------- PLAYBUTTONS --------------------*/
const play1 = document.querySelector('#play1');
const play2 = document.querySelector('#play2');
const play3 = document.querySelector('#play3');
const playbuttons = [play1, play2, play3];

/* -------------------- EVENTOS --------------------*/
let usuarioAbierto = false;
let grupoAbierto = false;
let actividadAbierto = false;
let abierto = [usuarioAbierto, grupoAbierto, actividadAbierto];

const eventoOption = (modulo, abierto, opciones, playbuttons) => () => {
    if(!abierto[modulo]){
        /*Mostramos botones de opciones de usuarios*/
        for (let i = 0; i < opciones[modulo].length; i++) {
            opciones[modulo][i].classList.add('optionvisible');
        }

        /*Ocultamos botones de opciones de otros módulos*/
        for (let i = 0; i < opciones.length; i++) {
            if (i != modulo){
                for (let j = 0; j < opciones[i].length; j++) {
                    opciones[i][j].classList.remove('optionvisible');
                }
            }
        }

        /*Aplicamos animación para playbuttons*/
        for (let i = 0; i < playbuttons.length; i++) {
            if (i == modulo){
                playbuttons[i].classList.add('rotado');
                playbuttons[i].classList.remove('norotado');
            }else{
                playbuttons[i].classList.remove('rotado');
                playbuttons[i].classList.add('norotado');
            }
        }
        /*Actualizamos estado de módulos abiertos*/
        for (let i = 0; i < abierto.length; i++) {
            if (i == modulo){
                abierto[i] = true;
            }else{
                abierto[i] = false;
            }
        }

    }
    else{
        /*Ocultamos todos los botones de opciones*/
        for (let i = 0; i < opciones[modulo].length; i++) {
            opciones[modulo][i].classList.remove('optionvisible');
        }

        /*Aplicamos animación para playbuttons*/
        for (let i = 0; i < playbuttons.length; i++) {
            playbuttons[i].classList.remove('rotado');
            playbuttons[i].classList.add('norotado');
        }

        /*Actualizamos estado de módulos abiertos*/
        for (let i = 0; i < abierto.length; i++) {
            abierto[i] = false;
        }
    }
}

menuCerrado.addEventListener('click', () => {
    sidebar.classList.add('visible');
    menuCerrado.classList.remove('visible');
    menuAbierto.classList.add('visible');
    sombra.classList.add('visible');
})
menuAbierto.addEventListener('click', () => {
    sidebar.classList.remove('visible');
    menuCerrado.classList.add('visible');
    menuAbierto.classList.remove('visible');
    sombra.classList.remove('visible');
})

sombra.addEventListener('click', () => {
    sidebar.classList.remove('visible');
    menuCerrado.classList.add('visible');
    menuAbierto.classList.remove('visible');
    sombra.classList.remove('visible');
})

usuarios.addEventListener('click', eventoOption(0, abierto, opciones, playbuttons));

grupos.addEventListener('click', eventoOption(1, abierto, opciones, playbuttons));

actividades.addEventListener('click', eventoOption(2, abierto, opciones, playbuttons));