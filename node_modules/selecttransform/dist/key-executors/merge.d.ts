import { DataObject, Transform } from '../internal';
import { KeyExecutor } from './key-executor';
export declare class Merge implements KeyExecutor {
    private name;
    constructor();
    getName(): string;
    fits(template: string): boolean;
    executeSync(template: DataObject, data: DataObject, ts: Transform, key: string, result: DataObject): object;
    execute(template: DataObject, data: DataObject, ts: Transform, key: string, result: DataObject): Promise<DataObject>;
}
