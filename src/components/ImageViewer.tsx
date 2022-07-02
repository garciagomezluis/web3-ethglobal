/* eslint-disable no-unused-vars */
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { FC, useEffect, useState } from 'react';

import { Alert, AlertIcon, Box, Button, Image, VStack, useStyleConfig } from '@chakra-ui/react';

import { useModal } from './Modal';

import ImageConfigModal from './ImageConfigModal';

import { useGlobal } from '../GlobalContext';
import { HEIGHT_PX, UsageType, WIDTH_PX, getUsageText } from '../utils';

const ImageOptions: FC<{
    openModal: () => void;
    remove: () => void;
}> = ({ openModal, remove }) => {
    const styles = useStyleConfig('ImageOptions', {
        variant: 'default',
    });

    return (
        <VStack __css={styles}>
            <Button
                colorScheme="pink"
                leftIcon={<AiFillEdit />}
                my="10px !important"
                w="70%"
                onClick={openModal}
            >
                Edit properties
            </Button>
            <Button
                colorScheme="pink"
                leftIcon={<AiFillCloseCircle />}
                my="10px !important"
                w="70%"
                onClick={remove}
            >
                Remove
            </Button>
        </VStack>
    );
};

export interface ImageViewerProps {
    file: File;
    removeFile: () => void;
    index: number;
    layerIndex: number;
}

export const ImageViewer: FC<ImageViewerProps> = ({ file, removeFile, layerIndex, index }) => {
    const [missingNameError, setMissingNameError] = useState(false);

    const [name, setName] = useState(file.name);
    const [usageType, setUsageType] = useState<UsageType>('atleast');
    const [usageValue, setUsageValue] = useState(1);

    const { open, close: closeModal } = useModal();

    const { updateImage } = useGlobal();

    useEffect(() => {
        updateImage(layerIndex, index, {
            file,
            name,
            usageType,
            usageValue,
        });
    }, [file, name, usageType, usageValue]);

    const openModal = () => {
        open({
            element: ImageConfigModal,
            props: {
                onClose: closeModal,
                onChangeName: setName,
                onChangeUsageType: setUsageType,
                onChangeUsageValue: setUsageValue,
                defaultName: name,
                defaultUsageType: usageType,
                defaultUsageValue: usageValue,
            },
            locked: false,
        });
    };

    useEffect(() => {
        setMissingNameError(name === '');
    }, [name]);

    return (
        <Box h={HEIGHT_PX} pos="relative" w={WIDTH_PX}>
            <Image pos="absolute" src={URL.createObjectURL(file)} />

            {!missingNameError && (
                <Alert pos="absolute" status="success">
                    <AlertIcon />
                    {name} - {getUsageText(usageType)} {usageValue}
                </Alert>
            )}

            {missingNameError && (
                <Alert pos="absolute" status="error">
                    <AlertIcon />
                    Images must have a name
                </Alert>
            )}

            <ImageOptions openModal={openModal} remove={removeFile} />
        </Box>
    );
};

export default ImageViewer;
