import { FC } from 'react';
import { TraitInfo } from '../utils';
import { VStack, chakra, useMultiStyleConfig } from '@chakra-ui/react';

interface TraitProps extends TraitInfo {}

export const Trait: FC<TraitProps> = ({ name, value, usage }) => {
    const styles = useMultiStyleConfig('Trait', {});

    return (
        <VStack __css={styles.trait}>
            <chakra.p __css={styles.name}>{name}</chakra.p>
            <chakra.p __css={styles.value}>{value}</chakra.p>
            <chakra.p __css={styles.usage}>{usage}% have this trait</chakra.p>
        </VStack>
    );
};

export default Trait;
