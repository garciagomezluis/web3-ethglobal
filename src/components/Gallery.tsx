/* eslint-disable no-unused-vars */
import { Box, HStack } from '@chakra-ui/react';
import { FC, useEffect } from 'react';

import FileUpload from './FileUpload';
import ImageViewer from './ImageViewer';
import useGallery from '../hooks/gallery';

import { ImageConfig } from '../utils';
import { useLayers } from '../LayersContext';

export const Gallery: FC<{ id: string }> = ({ id }) => {
    const { items, push, remove, update, pushEnabled } = useGallery({});
    const { updateLayerImages } = useLayers();

    useEffect(() => {
        updateLayerImages(id, items);
    }, [items]);

    return (
        <HStack>
            <Box h="300px" maxW="calc(100% - 320px)" overflowY="hidden">
                <Box overflowX="scroll" pb="10" w="full">
                    <HStack pos="relative">
                        {items.map((item) => (
                            <Box key={item.id} flex="1" mx="5px !important">
                                <ImageViewer
                                    item={item}
                                    remove={() => remove(item.id)}
                                    update={(config: ImageConfig) => update(item.id, config)}
                                />
                            </Box>
                        ))}
                    </HStack>
                </Box>
            </Box>
            <FileUpload disabled={!pushEnabled} onSelect={push} />
        </HStack>
    );
};

export default Gallery;
