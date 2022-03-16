/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

import warning from 'warning';

import { CustomHook } from '../utils';

export interface UseStepperConfig {
    initialValue?: number;
    value?: number;
    step?: number;
    minValue?: number;
    maxValue?: number;
    onChange?: (value: number) => void;
}

export interface UseStepperProps {
    value: number;
    increment: () => void;
    decrement: () => void;
    atLowest: boolean;
    atGreatest: boolean;
}

const resolve = (value: number, fnBound: (...values: number[]) => number, bound?: number) =>
    bound ? fnBound(value, bound) : value;

export const useStepper: CustomHook<UseStepperConfig, UseStepperProps> = ({
    initialValue = 0,
    value,
    step = 1,
    minValue,
    maxValue,
    onChange,
}) => {
    const [state, setState] = useState(value || initialValue);

    const isControlled = typeof value !== 'undefined';

    const realValue = isControlled ? value : state;

    const atLowest = typeof minValue === 'number' && minValue === realValue;
    const atGreatest = typeof maxValue === 'number' && maxValue === realValue;

    if (process.env.NODE_ENV !== 'production') {
        useEffect(() => {
            warning(
                !(typeof minValue === 'number' && realValue < minValue),
                'Stepper value should be greater or equal than minValue',
            );
            warning(
                !(typeof maxValue === 'number' && maxValue < realValue),
                'Stepper value should be lower or equal than maxValue',
            );
        }, [realValue, minValue, maxValue]);
    }

    const increment = () => {
        const newValue = resolve(realValue + step, Math.min, maxValue);

        if (!isControlled) setState(newValue);

        if (typeof onChange === 'function') onChange(newValue);
    };

    const decrement = () => {
        const newValue = resolve(realValue - step, Math.max, minValue);

        if (!isControlled) setState(newValue);

        if (typeof onChange === 'function') onChange(newValue);
    };

    return { value: realValue, increment, decrement, atLowest, atGreatest };
};

export default useStepper;
