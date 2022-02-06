import { Box, HStack, IconButton, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { FC, useContext, useEffect, useRef, useState } from 'react';

import { BsTrash } from 'react-icons/bs';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

import mergeImages from 'merge-images';

import { GlobalContext } from './GlobalContext';
import Trait from './Trait';
import { getNewID } from './Commons';

export const Preview: FC = () => {
    const { combinations, insights } = useContext(GlobalContext);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const imageRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        const names = [
            ...combinations[selectedIndex].map((image) => URL.createObjectURL(image.file)),
        ];

        mergeImages(names).then((data) => {
            if (imageRef.current !== null) {
                imageRef.current.src = data;
            }
        });
    }, [selectedIndex]);

    const getTrait = (layerIndex: number, traitIndex: number) => {
        return {
            name: insights[layerIndex].name,
            value: insights[layerIndex].traits[traitIndex].name,
            usage: insights[layerIndex].traits[traitIndex].usage,
            id: getNewID(),
        };
    };

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
                    {selectedIndex + 1}/{combinations.length}
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
                        disabled={selectedIndex === combinations.length - 1}
                        icon={<AiOutlineArrowRight />}
                        onClick={() => setSelectedIndex((prev) => prev + 1)}
                    />
                </HStack>
            </VStack>
            <HStack justify="center" mt="30px !important" w="full" wrap="wrap">
                {combinations[selectedIndex].map((image, layerIndex) => {
                    const trait = getTrait(layerIndex, image.idx);

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
