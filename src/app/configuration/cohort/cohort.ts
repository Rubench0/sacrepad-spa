export class Cohort {
	constructor(
		public id: number,
		public active: number,
		public initialDate: string,
		public finalDate: string,
		public year: string,
		public code: string,
		public limit: number,
	){}
}