/**
 * Clase que estructura los datos de las cohortes.
 *
 * @export
 * @class ClassRoom
 */

 export class ClassRoom {
	constructor(
		public id: number,
		public edifice: string,
		public floor: string,
		public name: string,
	){}
}