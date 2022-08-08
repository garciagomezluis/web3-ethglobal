const theme = {
    // The base styles for each part
    baseStyle: {
        bg: 'rgba(100,100,100,.7)',
        pos: 'absolute',
        h: 'full',
        w: 'full',
        justifyContent: 'center',
        opacity: '0',
        transition: 'all 0.2s ease-in',
    },
    // The size styles for each part
    sizes: {},
    // The variant styles for each part
    variants: {
        default: {
            _hover: { opacity: '1' },
        },
    },
    // The default `size` or `variant` values
    defaultProps: {
        variant: 'default',
    },
};

export default theme;
