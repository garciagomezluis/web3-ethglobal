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
import React, { FC, useState } from 'react';

import { ImageConfig } from '../utils';
import Stepper from './Stepper';

const updateObj = (obj: any, key: string, value: any) => {
    return {
        ...obj,
        [key]: value,
    };
};

const ConfigForm: FC<{
    config: ImageConfig;
    setConfig: React.Dispatch<React.SetStateAction<ImageConfig>>;
}> = ({ config, setConfig }) => {
    const { name, usageType, usageValue } = config;

    const updateKV = (k: string, v: any) => setConfig((config) => updateObj(config, k, v));

    return (
        <>
            <FormControl>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Blue Sky"
                    value={name}
                    onChange={(e) => updateKV('name', e.target.value)}
                />
            </FormControl>

            <VStack align="flex-start" mt="5" w="full">
                <Text>Usage</Text>
                <HStack align="center" mt={4} w="full">
                    <Select
                        value={usageType}
                        onChange={(e) => updateKV('usageType', e.target.value)}
                    >
                        <option value="atleast">At least</option>
                        <option value="exact">Exact</option>
                        <option value="atmost">At most</option>
                    </Select>
                    <Spacer />
                    <Stepper
                        initialValue={1}
                        minValue={1}
                        value={usageValue}
                        onChange={(e) => updateKV('usageValue', e)}
                    />
                </HStack>
            </VStack>
        </>
    );
};

interface ImageConfigModalProps {
    onClose: () => void;
    onChange: (config: ImageConfig) => void;
    defaultConfig: ImageConfig;
}

export const ImageConfigModal: FC<ImageConfigModalProps> = ({
    onClose,
    onChange,
    defaultConfig,
}) => {
    const [config, setConfig] = useState<ImageConfig>(defaultConfig);

    const onClickSave = () => {
        onChange(config);
        onClose();
    };

    return (
        <>
            <ModalHeader>Image properties</ModalHeader>
            <ModalBody>
                <ConfigForm {...{ config, setConfig }} />
            </ModalBody>

            <ModalFooter>
                <Button mr={3} variant="ghost" onClick={onClose}>
                    Close
                </Button>
                <Button colorScheme="pink" onClick={onClickSave}>
                    Save
                </Button>
            </ModalFooter>
        </>
    );
};

export default ImageConfigModal;
