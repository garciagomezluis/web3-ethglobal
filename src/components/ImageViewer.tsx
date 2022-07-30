/* eslint-disable no-unused-vars */
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { FC, useEffect, useState } from 'react';

import { Alert, AlertIcon, Box, Button, Image, VStack, useStyleConfig } from '@chakra-ui/react';

import { useModal } from './Modal';

import ImageConfigModal from './ImageConfigModal';

import { GalleryItem, HEIGHT_PX, ImageConfig, WIDTH_PX, getUsageText } from '../utils';

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
    item: GalleryItem;
    remove: () => void;
    update: (config: ImageConfig) => void;
}

export const ImageViewer: FC<ImageViewerProps> = ({ item, remove, update }) => {
    const [missingNameError, setMissingNameError] = useState(false);

    const { open, close: closeModal } = useModal();

    const { file, config } = item;

    const { name, usageType, usageValue } = config;

    const openModal = () => {
        open({
            element: ImageConfigModal,
            props: {
                onClose: closeModal,
                onChange: update,
                defaultConfig: config,
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

            <ImageOptions openModal={openModal} remove={remove} />
        </Box>
    );
};

export default ImageViewer;
