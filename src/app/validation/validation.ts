export class ValidationPatterns {
    constructor(
        public text: string = '[A-ZÁÉÍÓÚ\u00f1\u00d1]{1}[a-záéíóúÿ\u00f1\u00d1]*',
        public cedula: string = '[0-9]{1,8}',
        public phone: string = '[0]{1}[24]{1}[1-2]{1}[246]{1}[0-9]{7}',
        public user: string = '[a-zA-Z-0-9 _ÿ\u00f1\u00d1]*',
        public email: string = '[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})',
        public password: string = '(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$', // al menos una mayuscula, una minuscula, un numero y un caracter especial.
    ) {
    }
}