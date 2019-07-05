/**
 * Clase que estructura los datos de acciones.
 * 
 * @export
 * @class Actions
 */
export class Actions {
	constructor(
		public id: number,
		public user: string,
		public model: string,
		public action: string,
		public date: string,
		public description: string,
	){}
}