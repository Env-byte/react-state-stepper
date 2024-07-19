import { Step } from './step';

/**
 * Gets a union of the name of the steps from the array of steps.
 */
export type GetName<T extends Step<string>[]> = T extends Step<infer U>[]
    ? U
    : never;

export namespace utils {
    /**
     * Used to create a list of steps with correct typings returned.
     * Main usage is to be able to grab the name of the step from the list.
     * Example:
     * const steps = utils.create(['a', 'b', 'c']);
     * type Steps = GetName<typeof steps>; // a | b | c
     * @param steps
     */
    export const create = <Name extends string>(steps: Step<Name>[]) => {
        return steps;
    };
}
