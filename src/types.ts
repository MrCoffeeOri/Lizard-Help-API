import { Types } from "mongoose";

declare module 'express-session' { // Declaração para adicionar o tipo 'User' a variavel de sessão
    interface SessionData {
      user: ISessionUser;
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

export interface ISessionUser {
    name: string,
    email: string,
    password: string,
}

export interface IUser extends ISessionUser {
  type: string,
  avaible: boolean,
}