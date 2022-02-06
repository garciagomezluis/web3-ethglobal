import { FC } from 'react';
import { Text, VStack } from '@chakra-ui/react';

export const Trait: FC = () => {
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
                Background
            </Text>
            <Text color="gray.500" fontSize="lg" fontWeight="bold" mt="5px !important">
                Dark
            </Text>

            <Text color="black.400" fontSize="xs" letterSpacing="1px" mt="5px !important">
                12% have this trait
            </Text>
        </VStack>
    );
};

export default Trait;
