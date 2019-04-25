export class Cohort {
	constructor(
		public id: number,
		public active: string,
		public initial: string,
		public final: string,
		public year: number,
		public code: string,
		public limit: object,
	){}
}