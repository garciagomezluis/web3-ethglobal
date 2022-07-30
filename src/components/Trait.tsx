import { FC } from 'react';
import { TraitInfo } from '../utils';
import { Text, VStack } from '@chakra-ui/react';

interface TraitProps extends TraitInfo {}

export const Trait: FC<TraitProps> = ({ name, value, usage }) => {
    return (
        <VStack
            bg="gray.100"
            border="2px solid transparent"
            borderColor="pink.500"
            borderRadius="10px"
            justify="center"
            maxW="200px"
            minW="150px"
            p="3"
        >
            <Text
                color="pink.500"
                fontSize="x-small"
                letterSpacing="1px"
                m="0 !important"
                textTransform="uppercase"
            >
                {name}
            </Text>
            <Text color="gray.500" fontSize="lg" fontWeight="bold" mt="5px !important">
                {value}
            </Text>

            <Text color="black.400" fontSize="xs" letterSpacing="1px" mt="5px !important">
                {usage}% have this trait
            </Text>
        </VStack>
    );
};

export default Trait;
