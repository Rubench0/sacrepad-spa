/**
 * Clase que estructura los datos para el cambio de contraseña de los usuarios.
 * 
 * @export
 * @class ChangePassword
 */

export class ChangePassword {
	constructor(
		public id: number,
		public password_old: string,
		public password_new: string,
	){}
}