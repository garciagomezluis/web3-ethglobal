/* eslint-disable no-restricted-syntax */
import {
    Accordion,
    Button,
    Container,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    HStack,
    Spacer,
    useDisclosure,
    useToast,
} from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import { AiFillPlusCircle } from 'react-icons/ai';

import Layer from './Layer';
import Preview from './Preview';
import { GlobalContext, LayerType } from './GlobalContext';

function App() {
    const { getLayers, createLayer, calculateCombinations, combinations, generalError } =
        useContext(GlobalContext);

    const layers = getLayers();

    const toast = useToast();

    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        createLayer();
        createLayer();
    }, []);

    const previewClick = () => {
        if (combinations.length !== 0 || calculateCombinations()) {
            onOpen();
        }
    };

    useEffect(() => {
        if (generalError !== '') {
            toast({
                title: 'Please check',
                description: generalError,
                status: 'warning',
                duration: 3000,
                position: 'top-right',
                variant: 'left-accent',
                isClosable: true,
            });
        }
    }, [generalError]);

    return (
        <Container maxW="container.xl">
            <Drawer isOpen={isOpen} size="md" onClose={onClose}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader bg="pink.500" color="white" fontSize="xl">
                        Collection preview
                    </DrawerHeader>
                    <DrawerBody>
                        <Preview />
                    </DrawerBody>
                    <DrawerFooter>
                        <HStack w="full">
                            <Spacer />
                            <Button colorScheme="pink" variant="solid" onClick={() => {}}>
                                Mint collection
                            </Button>
                        </HStack>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Accordion>
                {layers.map((layer: LayerType, i: number) => (
                    <Layer
                        key={layer.id}
                        gallery={layer.gallery}
                        id={layer.id}
                        moveDownAllowed={i < layers.length - 1}
                        moveUpAllowed={i > 0}
                        name={layer.name}
                    />
                ))}
            </Accordion>

            <HStack my="5">
                <Button
                    colorScheme="pink"
                    leftIcon={<AiFillPlusCircle />}
                    variant="solid"
                    onClick={createLayer}
                >
                    Add layer
                </Button>

                <Button
                    colorScheme="pink"
                    disabled={generalError !== ''}
                    variant="solid"
                    onClick={previewClick}
                >
                    Preview
                </Button>
            </HStack>
        </Container>
    );
}

export default App;
