import { extendTheme } from '@chakra-ui/react';

import FileUpload from './theme/FileUpload';
import ImageOptions from './theme/ImageOptions';

export default extendTheme({
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
    },
});
