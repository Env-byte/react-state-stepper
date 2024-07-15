import { isStepObject, StepConfig, UseStepProps, useStepState } from './step';
import { useMeta, useStep, useTimer } from './hooks';
import { useEffect, useMemo, useRef } from 'react';

interface StateStepperReturn<Name extends string> {
    current: Name;
    meta: {
        current: StepConfig<Name>;
        previous: Name | undefined;
        next: Name | undefined;
    };
    next: () => void;
    previous: () => void;
}

interface UseStateStepperProps<Name extends string>
    extends UseStepProps<Name> {}

export const useStateStepper = <Name extends string>({
    steps,
    loop,
}: UseStateStepperProps<Name>): StateStepperReturn<Name> => {
    const stepsRef = useRef(steps);

    const [step, next, previous] = useStepState({
        steps: stepsRef.current,
        loop,
    });

    useEffect(() => {
        stepsRef.current = steps;
    }, [steps]);

    const current = useStep({
        stepsRef,
        step,
    });

    if (current === undefined) throw new Error(`Step '${step}' not found`);

    useTimer({ current, onEnd: next });

    const meta = useMeta({ current, loop, stepsRef });

    return useMemo(
        () => ({
            current: step,
            meta,
            next,
            previous,
        }),
        [step, next, previous, meta]
    );
};
