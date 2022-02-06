import { Button, HStack, IconButton, Image, Spacer, Text, VStack } from '@chakra-ui/react';
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
                <Text textAlign="right" w="full">
                    {selectedIndex + 1}/{combinations.length}
                </Text>
                <Image ref={imageRef} boxSize="300px" />
                <HStack justify="center" w="full">
                    <IconButton
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
            <HStack mt="30px !important" w="full">
                {combinations[selectedIndex].map((image, layerIndex) => {
                    const trait = getTrait(layerIndex, image.idx);

                    return (
                        <Trait
                            key={trait.id}
                            name={trait.name}
                            usage={trait.usage}
                            value={trait.value}
                        />
                    );
                })}
            </HStack>
            <HStack w="full">
                <Spacer />
                <Button colorScheme="pink" variant="solid" onClick={() => {}}>
                    Mint collection
                </Button>
            </HStack>
        </VStack>
    );
};

export default Preview;
