import { Box, HStack, IconButton, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { FC, useEffect, useRef, useState } from 'react';

import { BsTrash } from 'react-icons/bs';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

import Trait from './Trait';
import { TraitInfo } from '../utils';

interface PreviewProps {
    images: string[];
    traits: TraitInfo[][];
}

export const Preview: FC<PreviewProps> = ({ images, traits }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (imageRef.current !== null) {
            imageRef.current.src = images[selectedIndex];
        }
    }, [selectedIndex, images]);

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
                    {selectedIndex + 1}/{images.length}
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
                        disabled={selectedIndex === 0}
                        icon={<AiOutlineArrowLeft />}
                        onClick={() => setSelectedIndex((prev) => prev - 1)}
                    />
                    <IconButton
                        aria-label="next"
                        colorScheme="pink"
                        disabled={selectedIndex === images.length - 1}
                        icon={<AiOutlineArrowRight />}
                        onClick={() => setSelectedIndex((prev) => prev + 1)}
                    />
                </HStack>
            </VStack>
            <HStack justify="center" mt="30px !important" w="full" wrap="wrap">
                {traits.length > 0 &&
                    traits[selectedIndex].map((trait: TraitInfo) => {
                        return (
                            <Box key={trait.id} m="5px !important">
                                <Trait name={trait.name} usage={trait.usage} value={trait.value} />
                            </Box>
                        );
                    })}
            </HStack>
        </VStack>
    );
};

export default Preview;
