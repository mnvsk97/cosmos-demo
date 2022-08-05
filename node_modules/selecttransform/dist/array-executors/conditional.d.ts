import { DataObject, Transform } from '../internal';
import { ArrayExecutor } from './array-executor';
export declare class Conditional implements ArrayExecutor {
    private name;
    constructor();
    getName(): string;
    /**
     * Check given parameter whether it is an array of conditionals.
     *
     * @param {Array<any>} template Template to check
     */
    fits(template: Array<any>): boolean;
    /**
     * Transforms the data using provided template.
     *
     * @param {Array<any>} template
     * @param {object} data
     * @param {Transform} Transformer
     */
    executeSync(template: Array<any>, data: DataObject, ts: Transform): DataObject;
    /**
     * Transforms the data using provided template.
     *
     * @param {Array<any>} template
     * @param {object} data
     * @param {Transform} Transformer
     */
    execute(template: Array<any>, data: DataObject, ts: Transform): Promise<DataObject>;
}
