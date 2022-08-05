import { DataObject, Transform } from '../internal';
import { KeyExecutor } from './key-executor';
export declare class Optional implements KeyExecutor {
    private name;
    constructor();
    getName(): string;
    fits(template: string): boolean;
    executeSync(template: DataObject, data: DataObject, ts: Transform, key: string, result: DataObject): DataObject;
    execute(template: DataObject, data: DataObject, ts: Transform, key: string, result: DataObject): Promise<DataObject>;
}
