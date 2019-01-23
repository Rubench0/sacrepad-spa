export class User {
	constructor(
		public id: number,
		public login: string,
		public password: string,
		public email: string,
		public rol: string,
		public name: string,
		public surname: string,
		public phone: string,
	){}
}