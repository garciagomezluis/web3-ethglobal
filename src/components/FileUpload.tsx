/* eslint-disable no-unused-vars */
/* eslint-disable react/require-default-props */
import { FC } from 'react';

import useFileSelection from '../hooks/fileSelection';
import { Box, Text, useStyleConfig } from '@chakra-ui/react';
import { HEIGHT_PX, MAX_AMOUNT_IMAGES, WIDTH_PX } from '../Commons';

interface FileUploadProps {
    onSelect?: (files: File[]) => void;
    disabled?: boolean;
}

export const FileUpload: FC<FileUploadProps> = ({ onSelect, disabled = false }) => {
    const { open } = useFileSelection({
        accept: 'image/png',
        multiple: true,
        onSelect,
    });

    const styles = useStyleConfig('FileUpload', {
        variant: disabled ? 'disabled' : 'default',
    });

    const handleOnClick = () => {
        if (!disabled) open();
    };

    return (
        <Box __css={styles} onClick={handleOnClick}>
            <Text>Click to import images</Text>
            <Text>
                Up to {MAX_AMOUNT_IMAGES} - (PNG) {WIDTH_PX} x {HEIGHT_PX}
            </Text>
        </Box>
    );
};

export default FileUpload;
