import { extendTheme } from '@chakra-ui/react';

import FileUpload from './theme/FileUpload';

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
    },
});
