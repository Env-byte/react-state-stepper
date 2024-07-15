import { useCallback, useState } from 'react';

//step config object, with timers for state transitions
export interface StepConfig<Name extends string> {
    //in milliseconds
    timer?: number;
    name: Name;
}

export type Step<Name extends string> = Name | StepConfig<Name>;

export const isStepObject = <Name extends string>(
    item: Step<Name> | undefined
): item is StepConfig<Name> => {
    return typeof item === 'object';
};

export const getStepName = <Name extends string>(item: Step<Name>): Name => {
    return isStepObject(item) ? item.name : item;
};

interface GetStep<Name extends string> {
    steps: Step<Name>[];
    current: Step<Name>;
}

export const getStep = <Name extends string>({
    current,
    steps,
}: GetStep<Name>) => {
    return steps.find((s) => getStepName(s) === getStepName(current));
};

interface GetStepByOffset<Name extends string> {
    steps: Step<Name>[];
    current: Step<Name>;
    offset: -1 | 1;
    loop?: boolean;
}

export const getStepByOffset = <Name extends string>({
    steps,
    current,
    offset,
    loop = false,
}: GetStepByOffset<Name>) => {
    const index = steps.findIndex(
        (s) => getStepName(s) === getStepName(current)
    );
    const step =
        steps[index + offset] === undefined && loop
            ? steps[offset === -1 ? steps.length - 1 : 0]
            : steps[index + offset];

    if (step === undefined) return undefined;

    if (typeof step === 'object') {
        return step.name;
    }
    return step;
};

export interface UseStepProps<Name extends string> {
    steps: Step<Name>[];
    loop?: boolean;
}

export const useStepState = <Name extends string>({
    steps,
    loop,
}: UseStepProps<Name>): [Name, () => void, () => void] => {
    const [current, setCurrent] = useState<Name>(() => getStepName(steps[0]));

    const changeStep = useCallback(
        (offset: 1 | -1) => {
            const newIndex =
                steps.findIndex((s) => getStepName(s) === current) + offset;

            const index = loop
                ? (newIndex + steps.length) % steps.length
                : newIndex;

            const newStep = steps[index] ? getStepName(steps[index]) : current;
            setCurrent(newStep);
        },
        [steps, current, setCurrent]
    );

    const next = useCallback(() => changeStep(1), [changeStep]);
    const previous = useCallback(() => changeStep(-1), [changeStep]);

    return [current, next, previous];
};
