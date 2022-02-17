import { FC } from 'react';

import useFileSelection from './hooks/fileSelection';
import { Box, Text } from '@chakra-ui/react';
import { HEIGHT_PX, MAX_AMOUNT_IMAGES, WIDTH_PX } from './Commons';

export const FileUpload: FC<any> = ({ handleOnChange, disable }) => {
    const { open } = useFileSelection({
        accept: 'image/png',
        multiple: true,
        onSelect: handleOnChange,
    });

    const handleOnClick = () => {
        if (!disable) open();
    };

    const hover = disable
        ? {}
        : {
              cursor: 'pointer',
              bg: 'gray.300',
              borderColor: 'pink.500',
              color: 'pink.500',
          };

    return (
        <Box
            _hover={hover}
            alignItems="center"
            bg="gray.100"
            border="3px rgba(59, 130, 246, 0.5) dashed"
            boxSize="300px"
            color="gray.500"
            display="flex"
            flexDirection="column"
            justifyContent="space-around"
            transition="all 0.2s ease-in"
            onClick={handleOnClick}
        >
            <Box fontSize="xs" letterSpacing="1px" textAlign="center" textTransform="uppercase">
                <Text>Click to import images</Text>
                <Text>
                    Up to {MAX_AMOUNT_IMAGES} - (PNG) {WIDTH_PX} x {HEIGHT_PX}
                </Text>
            </Box>
        </Box>
    );
};

export default FileUpload;
