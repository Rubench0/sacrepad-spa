export class Lection {
	constructor(
		public id: number,
		public code: string,
		public subject: string,
		public classroom: string,
		public cohort: string,
		public facilitator: string,
		public inscriptions: number,
		public days: object,
	){}
}