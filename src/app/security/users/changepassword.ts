export class ChangePassword {
	constructor(
		public id: number,
		public password_old: string,
		public password_new: string,
	){}
}