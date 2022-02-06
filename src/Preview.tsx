import { Box, HStack, IconButton, Image, Spacer, Text, VStack } from '@chakra-ui/react';
import { FC, useContext, useEffect, useRef, useState } from 'react';

import { BsTrash } from 'react-icons/bs';
import { AiOutlineArrowLeft, AiOutlineArrowRight } from 'react-icons/ai';

import mergeImages from 'merge-images';

import Trait from './Trait';
import { getNewID } from './Commons';
import { CombinationData, GlobalContext } from './GlobalContext';

export const Preview: FC<any> = ({ b64Images, setB64Images, attrs, setAttrs }) => {
    const { combinations, insights } = useContext(GlobalContext);

    const [selectedIndex, setSelectedIndex] = useState(0);

    const imageRef = useRef<HTMLImageElement>(null);

    const getBase64Image = async (combination: CombinationData[]) => {
        const names = [...combination.map((image) => URL.createObjectURL(image.file))];

        const b64 = await mergeImages(names);

        return b64;
    };

    useEffect(() => {
        if (imageRef.current !== null) {
            imageRef.current.src = b64Images[selectedIndex];
        }
    }, [selectedIndex]);

    useEffect(() => {
        // Promise.all([...combinations.map(getBase64Image)]).then(setB64Images);

        Promise.all([
            ...combinations.map(async (combination: CombinationData[]) => {
                return {
                    base64: await getBase64Image(combination),
                    attrs: combination.map((image, layerIndex) => getTrait(layerIndex, image.idx)),
                };
            }),
        ]).then((results) => {
            const abase64 = [];
            const aattrs = [];

            for (let i = 0; i < results.length; i++) {
                abase64.push(results[i].base64);
                aattrs.push(results[i].attrs);
            }

            setB64Images(abase64);
            setAttrs(aattrs);
        });
    }, []);

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
                {attrs.length > 0 &&
                    attrs[selectedIndex].map((trait: any) => {
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
