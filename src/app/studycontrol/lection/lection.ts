export class Lection {
	constructor(
		public id: number,
		public code: string,
		public subject: string,
		public classroom: string,
		public facilitator: string,
		public limit: number,
		public inscriptions: number,
		public days: object,
	){}
}