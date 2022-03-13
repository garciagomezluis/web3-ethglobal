import { FC } from 'react';
import { Box, HStack } from '@chakra-ui/react';

import FileUpload from './FileUpload';
import ImageViewer from './ImageViewer';
import useGallery from '../hooks/gallery';

export const Gallery: FC<{ layerIndex: number }> = ({ layerIndex }) => {
    const { files, pushFiles, removeFile, canPushFiles } = useGallery({});

    return (
        <HStack>
            <Box h="300px" maxW="calc(100% - 320px)" overflowY="hidden">
                <Box overflowX="scroll" pb="10" w="full">
                    <HStack pos="relative">
                        {files.map((file, i) => (
                            <Box key={file.name} flex="1" mx="5px !important">
                                <ImageViewer
                                    file={file}
                                    index={i}
                                    layerIndex={layerIndex}
                                    removeFile={() => removeFile(file)}
                                />
                            </Box>
                        ))}
                    </HStack>
                </Box>
            </Box>
            <FileUpload disabled={canPushFiles} onSelect={pushFiles} />
        </HStack>
    );
};

export default Gallery;
