import { StyleFunctionProps, mode } from '@chakra-ui/theme-tools';

const theme = {
    // The base styles for each part
    baseStyle: (props: StyleFunctionProps) => ({
        alignItems: 'center',
        bg: mode('gray.100', 'blue.700')(props),
        border: '3px rgba(59, 130, 246, 0.5) dashed',
        color: mode('gray.500', 'gray.100')(props),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        letterSpacing: '1px',
        textAlign: 'center',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease-in',
    }),
    // The size styles for each part
    sizes: {
        sm: {
            boxSize: '300px',
            fontSize: 'xs',
            py: '100px',
        },
    },
    // The variant styles for each part
    variants: {
        default: (props: StyleFunctionProps) => ({
            _hover: {
                cursor: 'pointer',
                bg: mode('gray.300', 'blue.900')(props),
                borderColor: 'pink.500',
                color: 'pink.500',
            },
        }),
        disabled: {
            _hover: {},
        },
    },
    // The default `size` or `variant` values
    defaultProps: {
        variant: 'default',
        size: 'sm',
    },
};

export default theme;
