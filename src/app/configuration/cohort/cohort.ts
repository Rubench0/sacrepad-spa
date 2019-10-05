/**
 * Clase que estructura los datos de las cohortes.
 *
 * @export
 * @class Cohort
 */

export class Cohort {
	constructor(
		public id: number,
		public active: string,
		public initialDate: any,
		public finalDate: string,
		public year: string,
		public code: string,
		public limit: string,
	){}
}