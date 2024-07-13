import {
    getStep,
    getStepByOffset,
    isStepObject,
    StepConfig,
    UseStepProps,
    useStepState,
} from './step';
import { useTimer } from './useTimer';

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
    const [step, next, previous] = useStepState({ steps, loop });
    const current = getStep({ steps, current: step });

    if (current === undefined) throw new Error(`Step '${step}' not found`);

    const timer = isStepObject(current) ? current.timer : undefined;

    useTimer({ timer, onEnd: next });

    return {
        current: step,
        meta: {
            current: isStepObject(current) ? current : { name: current },
            previous: getStepByOffset({ steps, current, offset: -1, loop }),
            next: getStepByOffset({ steps, current, offset: +1, loop }),
        },
        next,
        previous,
    };
};
