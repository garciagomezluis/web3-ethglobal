import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { FC, useContext, useEffect, useState } from 'react';

import { Alert, AlertIcon, Box, Button, Image, VStack, useStyleConfig } from '@chakra-ui/react';

import { useModal } from './Modal';

import ImageConfigModal from './ImageConfigModal';

import { GlobalContext } from '../GlobalContext';
import { HEIGHT_PX, UsageType, WIDTH_PX, getUsageText } from '../Commons';

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
                variant="solid"
                w="70%"
                onClick={openModal}
            >
                Edit properties
            </Button>
            <Button
                colorScheme="pink"
                leftIcon={<AiFillCloseCircle />}
                my="10px !important"
                variant="solid"
                w="70%"
                onClick={remove}
            >
                Remove
            </Button>
        </VStack>
    );
};

export interface ImageViewerProps {
    id: string;
    file: File;
    name: string;
    usageType: UsageType;
    usageValue: number;
}

export const ImageViewer: FC<ImageViewerProps> = ({ id, file, name, usageType, usageValue }) => {
    const [missingNameError, setMissingNameError] = useState(false);

    const { setFileTraitValue, setFileUsageType, setFileUsageValue, removeFile } =
        useContext(GlobalContext);

    const { open, close: closeModal } = useModal();

    const openModal = () => {
        open({
            element: ImageConfigModal,
            props: {
                onClose: closeModal,
                onChangeName: (t: string) => setFileTraitValue(id, file, t),
                onChangeUsageType: (t: UsageType) => setFileUsageType(id, file, t),
                onChangeUsageValue: (t: number) => setFileUsageValue(id, file, t),
                defaultName: name,
                defaultUsageType: usageType,
                defaultUsageValue: usageValue,
            },
            locked: false,
        });
    };

    const remove = () => {
        removeFile(id, file);
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
