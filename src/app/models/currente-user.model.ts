import { Channel } from "./channel.model";

export interface CurrentUser {
    email: string,
    pass: string,
    type: number, // rol
    uid: string,
    canales?: Channel[]; // array de canales
    expire?: string;
}