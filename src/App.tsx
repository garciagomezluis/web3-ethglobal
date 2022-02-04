/* eslint-disable no-restricted-syntax */
import { useState } from 'react';
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Button,
    ChakraProvider,
    Container,
    Editable,
    EditableInput,
    EditablePreview,
    HStack,
} from '@chakra-ui/react';

import { AiFillCloseCircle, AiFillPlusCircle } from 'react-icons/ai';

import LayerGallery from './LayerGallery';

function App() {
    const [layers, setLayers] = useState<number[]>([]);

    const addLayer = () => {
        setLayers((prev) => [...prev, 1]);
    };

    return (
        <ChakraProvider>
            <Container maxW="container.xl">
                <Accordion>
                    {layers.map((layer: number, i: number) => (
                        <AccordionItem>
                            <AccordionButton>
                                <Editable defaultValue="Rename Layer" flex="1" textAlign="left">
                                    <EditablePreview />
                                    <EditableInput />
                                </Editable>
                                <AccordionIcon />
                            </AccordionButton>
                            <AccordionPanel pb={4}>
                                <HStack justify="flex-end" my="5">
                                    <Button
                                        colorScheme="pink"
                                        leftIcon={<AiFillCloseCircle />}
                                        variant="solid"
                                        onClick={addLayer}
                                    >
                                        Remove
                                    </Button>
                                </HStack>

                                <LayerGallery />
                            </AccordionPanel>
                        </AccordionItem>
                    ))}
                </Accordion>

                <HStack my="5">
                    <Button
                        colorScheme="pink"
                        leftIcon={<AiFillPlusCircle />}
                        variant="solid"
                        onClick={addLayer}
                    >
                        Add layer
                    </Button>
                </HStack>
            </Container>
        </ChakraProvider>
    );
}

export default App;
