import { extendTheme } from '@chakra-ui/react';

import Button from './theme/Button';
import FileUpload from './theme/FileUpload';
import ImageOptions from './theme/ImageOptions';

export default extendTheme({
    config: {
        initialColorMode: 'light',
        useSystemColorMode: false,
    },
    styles: {
        global: {
            '*': {
                boxSizing: 'border-box',
            },
        },
    },
    components: {
        FileUpload,
        ImageOptions,
        Button,
    },
});
