import { Button, HStack, IconButton, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { FC, useContext, useEffect, useRef, useState } from 'react';

import { BsTrash } from 'react-icons/bs';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

import mergeImages from 'merge-images';

import { GlobalContext } from './GlobalContext';
import Trait from './Trait';

export const Preview: FC = () => {
    const { combinations } = useContext(GlobalContext);

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
                {[1, 1].map((trait) => (
                    <Trait />
                ))}
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
