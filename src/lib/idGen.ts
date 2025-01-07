import { nanoid } from 'nanoid'

export class IDGen {
    public static id() {
        return nanoid(7);
    }
}