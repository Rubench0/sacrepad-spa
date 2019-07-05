/**
 * Clase que estructura los datos de acceso.
 * 
 * @export
 * @class Access
 */
export class Access {
	constructor(
		public id: number,
		public date: string,
		public so: string,
		public device: string,
		public adress: string,
		public user: string,
	){}
}