export class User {
    constructor(
        public _id: string,
        public phone: string,
        public email: string,
        public password: string,
        public provider: string
    ){}
}