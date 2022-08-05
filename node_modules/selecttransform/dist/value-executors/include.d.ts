import { DataObject, Transform } from '../internal';
import { ValueExecutor } from './value-executor';
export declare class Include implements ValueExecutor {
    private name;
    constructor();
    getName(): string;
    fits(template: string): boolean;
    executeSync(template: string, data: DataObject, ts: Transform): DataObject;
    execute(template: string, data: DataObject, ts: Transform): Promise<DataObject>;
}
