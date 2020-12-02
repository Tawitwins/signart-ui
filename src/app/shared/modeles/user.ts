export class User{
  id?: number;
  email?: string;
  password?: string;
  token?: string;
  prenom?: string;
  nom?: string;
  login?: string;
  roles?: string;
  userType?: string;
  oldAccount?: string;
  imgSignature?: string;
  certificat?: string;
  constructor(id: number,
    email: string,
    token: string,
    prenom: string,
    nom: string,
    login: string,
    roles: string,
    userType: string,
    oldAccount: string,
    imgSignature: string,
    certificat: string){}
}


export class AccountInfo{
  userName: string;
  password: string;
  constructor(
    userName: string,
    password: string,
    ){}
}