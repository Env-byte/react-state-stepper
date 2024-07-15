import React, { useEffect } from 'react';
import { useStateStepper } from './main';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, TestAPI } from 'vitest';
import { Step } from './step';

const consoleLogSpy = vi.spyOn(console, 'log');

const DummyComponent = ({ steps }: { steps: Step<string>[] }) => {
    const renderCount = React.useRef(0);
    const [counter, setCounter] = React.useState(0);

    const state = useStateStepper({
        steps,
    });

    useEffect(() => {
        console.log(state.meta.current.name);
    }, [state]);

    renderCount.current++;
    return (
        <div>
            <div data-testid={'render'}>{renderCount.current}</div>
            <div data-testid={'current'}>{state.current}</div>
            <div data-testid={'counter'}>{counter}</div>
            <button
                data-testid={'next-button'}
                onClick={() => {
                    state.next();
                }}
            >
                click
            </button>
            <button
                data-testid={'prev-button'}
                onClick={() => {
                    state.previous();
                }}
            >
                click
            </button>
            <button
                data-testid={'counter-button'}
                onClick={() => {
                    setCounter((c) => c + 1);
                }}
            >
                click
            </button>
        </div>
    );
};

interface DummyComponent {
    component: (steps: Step<string>[]) => {
        prevButton: HTMLElement;
        nextButton: HTMLElement;
        renderCount: HTMLElement;
        currentStep: HTMLElement;
        counterButton: HTMLElement;
    };
}

const dummyComponentTest = test.extend<DummyComponent>({
    component: async ({}, use) => {
        await use((steps) => {
            render(<DummyComponent steps={steps} />);
            return {
                prevButton: screen.getByTestId('prev-button'),
                nextButton: screen.getByTestId('next-button'),
                counterButton: screen.getByTestId('counter-button'),
                renderCount: screen.getByTestId('render'),
                currentStep: screen.getByTestId('current'),
            };
        });
    },
});

describe('Main', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('manual steps', () => {
        dummyComponentTest(
            'should progress via buttons, ensuring hook return is stable',
            async ({ component }) => {
                const {
                    renderCount,
                    prevButton,
                    currentStep,
                    nextButton,
                    counterButton,
                } = component(['a', 'b', 'c']);
                expect(renderCount.textContent).toBe('1');
                expect(currentStep.textContent).toBe('a');
                await userEvent.click(nextButton);
                expect(renderCount.textContent).toBe('2');
                expect(currentStep.textContent).toBe('b');
                await userEvent.click(nextButton);
                expect(renderCount.textContent).toBe('3');
                expect(currentStep.textContent).toBe('c');
                await userEvent.click(prevButton);
                expect(renderCount.textContent).toBe('4');
                expect(currentStep.textContent).toBe('b');
                expect(consoleLogSpy).toHaveBeenCalledTimes(4);
                await userEvent.click(counterButton);
                expect(consoleLogSpy).toHaveBeenCalledTimes(4);
            }
        );
    });

    describe('timer steps', () => {
        const testCases: { name: string; steps: Step<string>[] }[] = [
            {
                name: 'same timers',
                steps: [
                    { name: 'a', timer: 200 },
                    { name: 'b', timer: 200 },
                    { name: 'c', timer: 200 },
                ],
            },
            {
                name: 'different timers',
                steps: [
                    { name: 'a', timer: 150 },
                    { name: 'b', timer: 200 },
                    { name: 'c', timer: 250 },
                ],
            },
        ];

        dummyComponentTest.for(testCases)(
            'with timers - $name',
            async ({ steps }, { component }) => {
                const { renderCount, currentStep } = component(steps);
                expect(renderCount.textContent).toBe('1');
                expect(currentStep.textContent).toBe('a');
                await waitFor(
                    () => {
                        expect(currentStep.textContent).toBe('b');
                    },
                    {
                        timeout: 300,
                    }
                );

                await waitFor(
                    () => {
                        expect(currentStep.textContent).toBe('c');
                    },
                    {
                        timeout: 300,
                    }
                );
                expect(renderCount.textContent).toBe('3');
                expect(consoleLogSpy).toHaveBeenCalledTimes(3);
            }
        );
    });
});
