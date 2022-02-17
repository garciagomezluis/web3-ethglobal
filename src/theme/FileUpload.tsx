/* eslint-disable import/prefer-default-export */

const theme = {
    // The base styles for each part
    baseStyle: {
        alignItems: 'center',
        bg: 'gray.100',
        border: '3px rgba(59, 130, 246, 0.5) dashed',
        color: 'gray.500',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        letterSpacing: '1px',
        textAlign: 'center',
        textTransform: 'uppercase',
        transition: 'all 0.2s ease-in',
    },
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
        default: {
            _hover: {
                cursor: 'pointer',
                bg: 'gray.300',
                borderColor: 'pink.500',
                color: 'pink.500',
            },
        },
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
