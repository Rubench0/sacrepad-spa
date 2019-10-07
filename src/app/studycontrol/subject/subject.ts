/**
 * Clase que estructura los datos de las  asignaturas.
 *
 * @export
 * @class Subject
 */
export class Subject {
	constructor(
		public id: number,
		public name: string,
		public description: string,
		public classification: string,
		public type: string,
	){}
}