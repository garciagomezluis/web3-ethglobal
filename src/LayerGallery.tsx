/* eslint-disable no-restricted-syntax */
import { Box, HStack, useToast } from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { HEIGHT_PX, MAX_AMOUNT_IMAGES, WIDTH_PX } from './Commons';

import FileUpload from './FileUpload';
import ImageViewer from './ImageViewer';

export const filesToURL = (files: File[]) => files.map((file) => URL.createObjectURL(file));

const union = (obj1: any[], obj2: any[], key: string) => {
    const diff = [];

    for (const e1 of obj1) {
        let exists = false;

        for (const e2 of obj2) {
            if (e2[key] === e1[key]) {
                exists = true;
                break;
            }
        }

        if (!exists) {
            diff.push(e1);
        }
    }

    return [...diff, ...obj2];
};

const validImageDimension = async (url: string) => {
    const img: HTMLImageElement = document.createElement('img');

    img.src = url;

    return new Promise((resolve, reject) => {
        img.onerror = reject;

        img.onload = () => {
            if (img.naturalWidth === WIDTH_PX && img.naturalHeight === HEIGHT_PX) {
                resolve(true);
            }
            resolve(false);
        };
    });
};

export const GalleryLayer: FC = () => {
    const [loadedImages, setLoadedImages] = useState<File[]>([]);
    const [error, setError] = useState('');
    const toast = useToast();

    useEffect(() => {
        console.log(loadedImages);
    }, [loadedImages]);

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

    const handleOnChange = async (event: any) => {
        // console.log(...event.target.files);

        const files = [...event.target.files];
        const urls = filesToURL(files);
        const dimensionOk = urls.map(validImageDimension);
        const allDimensionOk = (await Promise.all(dimensionOk)).every((x) => x);

        if (!allDimensionOk) {
            setError(`Images must all be of ${WIDTH_PX}x${HEIGHT_PX}`);

            return;
        }

        const finalImages = union(files, loadedImages, 'name');

        if (finalImages.length > MAX_AMOUNT_IMAGES) {
            setError(`You can upload up to ${MAX_AMOUNT_IMAGES} layers`);

            return;
        }

        setLoadedImages(finalImages);
    };

    const onRemove = (e: File) => {
        let found = false;
        let i;

        for (i = 0; i < loadedImages.length && !found; i++) {
            found = loadedImages[i].name === e.name;
        }

        if (found) {
            const items = [...loadedImages];

            items.splice(i - 1, 1);
            setLoadedImages(items);
        }
    };

    return (
        <HStack>
            <Box h="300px" maxW="calc(100% - 320px)" overflowY="hidden">
                <Box overflowX="scroll" pb="10" w="full">
                    <HStack pos="relative">
                        {loadedImages.map((e: File) => {
                            const url = URL.createObjectURL(e);

                            return (
                                <Box key={url} flex="1" mx="5px !important">
                                    <ImageViewer src={url} onRemove={() => onRemove(e)} />
                                </Box>
                            );
                        })}
                    </HStack>
                </Box>
            </Box>
            <FileUpload
                disable={loadedImages.length === MAX_AMOUNT_IMAGES}
                handleOnChange={handleOnChange}
            />
        </HStack>
    );
};

export default GalleryLayer;
