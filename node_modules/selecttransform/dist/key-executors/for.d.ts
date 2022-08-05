import { DataObject, Transform } from '../internal';
import { KeyExecutor } from './key-executor';
export declare class For implements KeyExecutor {
    private name;
    constructor();
    getName(): string;
    fits(template: string): boolean;
    execute(template: DataObject, data: DataObject, ts: Transform, key: string, result: DataObject): Promise<DataObject>;
    executeSync(template: DataObject, data: DataObject, ts: Transform, key: string, result: DataObject): DataObject;
}
