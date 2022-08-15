import { StyleFunctionProps, mode } from '@chakra-ui/theme-tools';

const theme = {
    parts: ['trait', 'name', 'value', 'usage'],
    // The base styles for each part
    baseStyle: (props: StyleFunctionProps) => ({
        trait: {
            bg: mode('gray.100', 'gray.800')(props),
            borderColor: mode('pink.500', 'pink.500')(props),
        },
        name: {
            color: mode('pink.500', 'pink.500')(props),
        },
        value: {
            color: mode('gray.500', 'white')(props),
        },
        usage: {
            color: mode('black.400', 'white')(props),
        },
    }),
    // The size styles for each part
    sizes: {
        sm: {
            trait: {
                borderRadius: '10px',
                maxW: '200px',
                minW: '150px',
                p: '3',
                borderWidth: '2px',
            },
            name: {
                fontSize: 'x-small',
                letterSpacing: '1px',
            },
            value: {
                fontSize: 'lg',
            },
            usage: {
                fontSize: 'xs',
                letterSpacing: '1px',
            },
        },
    },
    // The variant styles for each part
    variants: {
        rigid: {
            trait: {
                justify: 'center',
                borderStyle: 'solid',
            },
            name: {
                textTransform: 'uppercase',
            },
            value: {
                fontWeight: 'bold',
            },
        },
    },
    // The default `size` or `variant` values
    defaultProps: {
        size: 'sm',
        variant: 'rigid',
    },
};

export default theme;
