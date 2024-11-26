import path, {join} from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
//Configuración de directorio raiz carpeta src
const __dirname = path.dirname(join(__filename,"../"));

export {__dirname}; // Exportamos la constante __dirname para poder usarla en otro archivo