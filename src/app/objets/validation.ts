/**
 * Clase contenedora de expresiones regulares para validaciones de campos en formulario.
 * 
 * @export
 * @class ValidationPatterns
 * 
 */

export class ValidationPatterns {
    constructor(
        public text: string = '[A-ZÁÉÍÓÚ\u00f1\u00d1]{1}[a-záéíóúÿ\u00f1\u00d1]*',
        public cedula: string = '[0-9]{1,8}',
        public phone: string = '[0]{1}[24]{1}[1-2]{1}[246]{1}[0-9]{7}',
        public user: string = '[a-zA-Z-0-9 _ÿ\u00f1\u00d1]*',
        public email: string = '[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})',
        public password: string = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&-._])[A-Za-z\d$@$!%*?&-._].{8,}', // al menos una mayuscula, una minuscula, un numero y un caracter especial.
        public codes: string = '[A-Z-0-9-]*', // al menos una mayuscula, una minuscula, un numero y un caracter especial.
        public number: string = '[0-9]*', // al menos una mayuscula, una minuscula, un numero y un caracter especial.
    ) {
    }
}