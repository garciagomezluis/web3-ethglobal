/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
import { FC } from 'react';
import { AiOutlineMinus, AiOutlinePlus } from 'react-icons/ai';
import { HStack, IconButton, Input } from '@chakra-ui/react';
import useStepper, { UseStepperConfig } from '../hooks/stepper';

interface StepperProps extends UseStepperConfig {
    width?: any;
}

export const Stepper: FC<StepperProps> = ({ width, ...props }) => {
    const { value: state, increment, decrement, atLowest, atGreatest } = useStepper(props);

    return (
        <HStack width={width}>
            <IconButton
                aria-label="substract"
                disabled={atLowest}
                icon={<AiOutlineMinus />}
                onClick={decrement}
            />
            <Input readOnly value={state} />
            <IconButton
                aria-label="substract"
                disabled={atGreatest}
                icon={<AiOutlinePlus />}
                onClick={increment}
            />
        </HStack>
    );
};

export default Stepper;
