/* eslint-disable no-restricted-syntax */
import { Accordion, Button, Container, HStack, useToast } from '@chakra-ui/react';
import { useContext, useEffect } from 'react';

import { AiFillPlusCircle } from 'react-icons/ai';

import Layer from './Layer';
import { GlobalContext, LayerType } from './GlobalContext';

function App() {
    const { getLayers, createLayer, calculateCombinations, combinations, generalError } =
        useContext(GlobalContext);

    const layers = getLayers();

    const toast = useToast();

    useEffect(() => {
        createLayer();
    }, []);

    const previewClick = () => {
        calculateCombinations();
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
            <Accordion allowToggle>
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
