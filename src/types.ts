import { Types } from "mongoose";

declare module 'express-session' { // Declaração para adicionar o tipo 'User' a variavel de sessão
    interface SessionData {
      user: IUser;
    }
  }

export interface ICompany {
    name: string,
    email: string,
    owner: string,
    phone: string,
    cid: string,
    people: [string]
}

export interface IUser {
  name: string,
  email: string,
  password: string,
  type: string,
  avaible: boolean,
  _id: Types.ObjectId
}