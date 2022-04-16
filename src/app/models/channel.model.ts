import { Sample } from "./sample.model";

export interface Channel {
    name: string,
    samples?: Sample[]
}