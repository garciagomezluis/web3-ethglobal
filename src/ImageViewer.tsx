import { FC } from 'react';
import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { Box, Button, Image, VStack } from '@chakra-ui/react';
import { HEIGHT_PX, WIDTH_PX } from './Commons';

export interface ImageViewerProps {
    src: string;
    onRemove: any;
}

export const ImageViewer: FC<ImageViewerProps> = ({ src, onRemove }) => {
    return (
        <Box h={HEIGHT_PX} w={WIDTH_PX}>
            <Image h={HEIGHT_PX} pos="absolute" src={src} w={WIDTH_PX} />
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
