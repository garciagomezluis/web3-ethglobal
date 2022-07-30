import { Box, HStack, IconButton, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { FC, useEffect, useRef } from 'react';

import { BsTrash } from 'react-icons/bs';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

import { CombinationType } from '../hooks/combinator';
import Trait from './Trait';
import { TraitInfo } from '../utils';
import useStepper from '../hooks/stepper';

interface PreviewProps extends CombinationType {}

export const Preview: FC<PreviewProps> = ({ images, traits }) => {
    const {
        value: current,
        increment,
        decrement,
        atLowest,
        atGreatest,
    } = useStepper({ initialValue: 0, minValue: 0, maxValue: images.length - 1 });

    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imageRef.current !== null) {
            imageRef.current.src = images[current];
        }
    }, [current, images]);

    return (
        <VStack justify="center">
            <VStack w="300px">
                <Text
                    color="pink.500"
                    fontSize="x-large"
                    fontWeight="semibold"
                    letterSpacing="2px"
                    textAlign="right"
                    w="full"
                >
                    {current + 1}/{images.length}
                </Text>
                <Image ref={imageRef} boxSize="300px" />
                <HStack justify="center" w="full">
                    <IconButton
                        disabled
                        aria-label="remove"
                        colorScheme="pink"
                        icon={<BsTrash />}
                        onClick={() => {}}
                    />
                    <Spacer />
                    <IconButton
                        aria-label="prev"
                        colorScheme="pink"
                        disabled={atLowest}
                        icon={<AiOutlineArrowLeft />}
                        onClick={decrement}
                    />
                    <IconButton
                        aria-label="next"
                        colorScheme="pink"
                        disabled={atGreatest}
                        icon={<AiOutlineArrowRight />}
                        onClick={increment}
                    />
                </HStack>
            </VStack>
            <HStack justify="center" mt="30px !important" w="full" wrap="wrap">
                {traits.length > 0 &&
                    traits[current].map(({ id, name, usage, value }: TraitInfo) => (
                        <Box key={id} m="5px !important">
                            <Trait id={id} name={name} usage={usage} value={value} />
                        </Box>
                    ))}
            </HStack>
        </VStack>
    );
};

export default Preview;
