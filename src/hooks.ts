import { MutableRefObject, useEffect, useMemo } from 'react';
import { getStep, getStepByOffset, isStepObject, Step } from './step';

interface UseTimerProps<Name extends string> {
    current: Step<Name>;
    onEnd: () => void;
}

export const useTimer = <Name extends string>({
    current,
    onEnd,
}: UseTimerProps<Name>) => {
    useEffect(() => {
        const timer = isStepObject(current) ? current.timer : undefined;

        if (timer === undefined) return;
        const timeoutHandler = setTimeout(() => {
            onEnd();
        }, timer);
        return () => {
            clearTimeout(timeoutHandler);
        };
    }, [current]);
};

interface UseMetaProps<Name extends string> {
    current: Step<Name>;
    loop?: boolean;
    stepsRef: MutableRefObject<Step<Name>[]>;
}

export const useMeta = <Name extends string>({
    current,
    loop,
    stepsRef,
}: UseMetaProps<Name>) => {
    return useMemo(() => {
        return {
            current: isStepObject(current) ? current : { name: current },
            previous: getStepByOffset({
                steps: stepsRef.current,
                current,
                offset: -1,
                loop,
            }),
            next: getStepByOffset({
                steps: stepsRef.current,
                current,
                offset: +1,
                loop,
            }),
        };
    }, [current, loop]);
};

interface UseStepProps<Name extends string> {
    stepsRef: MutableRefObject<Step<Name>[]>;
    step: Name;
}

export const useStep = <Name extends string>({
    stepsRef,
    step,
}: UseStepProps<Name>) => {
    return useMemo(
        () =>
            getStep({
                steps: stepsRef.current,
                current: step,
            }),
        [step]
    );
};
