import { Channel } from "./channel.model";

export interface CurrentUser {
    email: string,          // direccion de email
    pass: string,           // contrasena
    type: number,           // tipo: (prueba: 0, mensual: 1, otro: 2)
    role: number,           // rol: 0 administrador, 1 Vendedor, 2 cliente
    uid: string,            // identificacion unica de usuario
    canales?: Channel[];    // array de canales
    expire?: string;        // string DD/MM/AAAA
    time?: number;          // epoch date que equivale a 10800000    
    active?: boolean        // booleano que determina si la cuenta esta activa
    points?: number         // credito
    createdBy?: string      // uid del vendedor
}