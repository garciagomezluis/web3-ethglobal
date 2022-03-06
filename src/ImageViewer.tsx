import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { FC, useContext, useEffect, useState } from 'react';

import { Alert, AlertIcon, Box, Button, Image, VStack } from '@chakra-ui/react';

import { useModal } from './components/Modal';

import ImageConfigModal from './components/ImageConfigModal';

import { GlobalContext } from './GlobalContext';
import { HEIGHT_PX, UsageType, WIDTH_PX, getUsageText } from './Commons';

export interface ImageViewerProps {
    file: File;
    onRemove: any;
    id: string;
    traitValue: string;
    usageType: UsageType;
    usageValue: number;
}

export const ImageViewer: FC<ImageViewerProps> = ({
    file,
    onRemove,
    id,
    traitValue,
    usageType,
    usageValue,
}) => {
    const [missingNameError, setMissingNameError] = useState(false);

    const { open, close: closeModal } = useModal();

    const { setFileTraitValue, setFileUsageType, setFileUsageValue } = useContext(GlobalContext);

    const openModal = () => {
        open({
            element: ImageConfigModal,
            props: {
                onClose: closeModal,
                onChangeName: (t: string) => setFileTraitValue(id, file, t),
                onChangeUsageType: (t: UsageType) => setFileUsageType(id, file, t),
                onChangeUsageValue: (t: number) => setFileUsageValue(id, file, t),
                defaultName: traitValue,
                defaultUsageType: usageType,
                defaultUsageValue: usageValue,
            },
            locked: false,
        });
    };

    useEffect(() => {
        setMissingNameError(traitValue === '');
    }, [traitValue]);

    return (
        <Box h={HEIGHT_PX} pos="relative" w={WIDTH_PX}>
            <Image h={HEIGHT_PX} pos="absolute" src={URL.createObjectURL(file)} w={WIDTH_PX} />
            {!missingNameError && (
                <Alert pos="absolute" status="success">
                    <AlertIcon />
                    {traitValue} - {getUsageText(usageType)} {usageValue}
                </Alert>
            )}
            {missingNameError && (
                <Alert pos="absolute" status="error">
                    <AlertIcon />
                    Images must have a name
                </Alert>
            )}
            <VStack
                _hover={{ opacity: '1' }}
                bg="rgba(100,100,100,.7)"
                h={HEIGHT_PX}
                justify="center"
                opacity="0"
                pos="absolute"
                transition="all 0.2s ease-in"
                w={WIDTH_PX}
            >
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
                    onClick={onRemove}
                >
                    Remove
                </Button>
            </VStack>
        </Box>
    );
};

export default ImageViewer;
