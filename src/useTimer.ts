import { useEffect } from 'react';

interface UseTimerProps {
    timer: number | undefined;
    onEnd: () => void;
}

export const useTimer = ({ timer, onEnd }: UseTimerProps) => {
    useEffect(() => {
        if (timer === undefined) return;
        const timeoutHandler = setTimeout(() => {
            onEnd();
        }, timer);
        return () => {
            clearTimeout(timeoutHandler);
        };
    }, [timer]);
};
