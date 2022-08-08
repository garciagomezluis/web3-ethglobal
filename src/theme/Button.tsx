import { StyleFunctionProps } from '@chakra-ui/theme-tools';

const theme = {
    variants: {
        custom: (props: StyleFunctionProps) => {
            const { colorScheme: c } = props;

            const bg = `${c}.500`;
            const color = 'white';
            const hoverBg = `${c}.600`;
            const activeBg = `${c}.700`;

            return {
                bg,
                color,
                _hover: {
                    bg: hoverBg,
                    _disabled: {
                        bg,
                    },
                },
                _active: { bg: activeBg },
            };
        },
    },
    defaultProps: {
        variant: 'custom',
        colorScheme: 'pink',
    },
};

export default theme;
