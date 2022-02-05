import { Button, HStack, Input } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';

// TODO: check: useNumberInput not working (weird)
export const Stepper: FC<any> = ({ onChange, value }) => {
    const [stepper, setStepper] = useState<number>(value);

    useEffect(() => onChange(stepper), [stepper]);

    const onAddClick = () => setStepper((prev) => prev + 1);

    const onSubsClick = () => setStepper((prev) => Math.max(1, prev - 1));

    return (
        <HStack maxW="150px">
            <Button onClick={onSubsClick}>-</Button>
            <Input readOnly value={stepper} />
            <Button onClick={onAddClick}>+</Button>
        </HStack>
    );
};

export default Stepper;
