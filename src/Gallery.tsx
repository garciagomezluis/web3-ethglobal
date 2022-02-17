import { Box, HStack, useToast } from '@chakra-ui/react';
import { FC, useContext, useEffect, useState } from 'react';
import {
    HEIGHT_PX,
    MAX_AMOUNT_IMAGES,
    WIDTH_PX,
    filesToURL,
    union,
    validImageDimension,
} from './Commons';

import FileUpload from './components/FileUpload';
import ImageViewer from './ImageViewer';
import { GalleryType, GlobalContext, ImageViewerType } from './GlobalContext';

export interface GalleryProps extends GalleryType {
    id: string;
}

export const Gallery: FC<GalleryProps> = ({ images, id }) => {
    const { setFiles, removeFile } = useContext(GlobalContext);

    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        if (error !== '') {
            toast({
                title: 'Try again',
                description: error,
                status: 'warning',
                duration: 3000,
                position: 'top-right',
                variant: 'left-accent',
                isClosable: true,
            });
        }
    }, [error]);

    const handleOnChange = async (files: File[]) => {
        // console.log(...event.target.files);
        const urls = filesToURL(files);
        const dimensionOk = urls.map(validImageDimension);
        const allDimensionOk = (await Promise.all(dimensionOk)).every((x) => x);

        if (!allDimensionOk) {
            setError(`Images must all be of ${WIDTH_PX}x${HEIGHT_PX}`);

            return;
        }

        const finalFiles: File[] = union(
            files,
            images.map((i) => i.file),
            'name',
        );

        if (finalFiles.length > MAX_AMOUNT_IMAGES) {
            setError(`You can upload up to ${MAX_AMOUNT_IMAGES} images by layer`);

            return;
        }

        setFiles(id, finalFiles);
    };

    return (
        <HStack>
            <Box h="300px" maxW="calc(100% - 320px)" overflowY="hidden">
                <Box overflowX="scroll" pb="10" w="full">
                    <HStack pos="relative">
                        {images.map((i: ImageViewerType) => {
                            const url = URL.createObjectURL(i.file);

                            return (
                                <Box key={url} flex="1" mx="5px !important">
                                    <ImageViewer
                                        file={i.file}
                                        id={id}
                                        traitValue={i.traitValue}
                                        usageType={i.usageType}
                                        usageValue={i.usageValue}
                                        onRemove={() => removeFile(id, i.file)}
                                    />
                                </Box>
                            );
                        })}
                    </HStack>
                </Box>
            </Box>
            <FileUpload disabled={images.length === MAX_AMOUNT_IMAGES} onSelect={handleOnChange} />
        </HStack>
    );
};

export default Gallery;
