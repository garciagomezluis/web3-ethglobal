/* eslint-disable no-unused-vars */
import {
    Button,
    FormControl,
    FormLabel,
    HStack,
    Input,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Select,
    Spacer,
    Text,
    VStack,
} from '@chakra-ui/react';
import { FC, useState } from 'react';

import Stepper from './Stepper';

import { UsageType } from '../Commons';

const ConfigForm: FC<any> = ({
    name,
    setName,
    usageType,
    setUsageType,
    usageValue,
    setUsageValue,
}) => {
    return (
        <>
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Blue Sky"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>

            <VStack align="flex-start" mt="5" w="full">
                <Text>Usage</Text>
                <HStack align="center" mt={4} w="full">
                    <Select value={usageType} onChange={(e) => setUsageType(e.target.value)}>
                        <option value="atleast">At least</option>
                        <option value="exact">Exact</option>
                        <option value="atmost">At most</option>
                    </Select>
                    <Spacer />
                    <Stepper
                        initialValue={1}
                        minValue={1}
                        value={usageValue}
                        onChange={setUsageValue}
                    />
                </HStack>
            </VStack>
        </>
    );
};

interface ImageConfigModalProps {
    onClose: () => void;
    onChangeName: (name: string) => void;
    onChangeUsageType: (type: UsageType) => void;
    onChangeUsageValue: (value: number) => void;
    defaultName: string;
    defaultUsageType: UsageType;
    defaultUsageValue: number;
}

export const ImageConfigModal: FC<ImageConfigModalProps> = ({
    onClose,
    onChangeName,
    onChangeUsageType,
    onChangeUsageValue,
    defaultName,
    defaultUsageType,
    defaultUsageValue,
}) => {
    const [name, setName] = useState(defaultName);
    const [usageType, setUsageType] = useState(defaultUsageType);
    const [usageValue, setUsageValue] = useState(defaultUsageValue);

    const onClickSave = () => {
        onChangeName(name);
        onChangeUsageType(usageType);
        onChangeUsageValue(usageValue);
        onClose();
    };

    return (
        <>
            <ModalHeader>Image properties</ModalHeader>
            <ModalBody>
                <ConfigForm
                    {...{ name, setName, usageType, setUsageType, usageValue, setUsageValue }}
                />
            </ModalBody>

            <ModalFooter>
                <Button colorScheme="pink" mr={3} onClick={onClose}>
                    Close
                </Button>
                <Button variant="ghost" onClick={onClickSave}>
                    Save
                </Button>
            </ModalFooter>
        </>
    );
};

export default ImageConfigModal;
