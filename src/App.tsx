/* eslint-disable no-restricted-syntax */
import { useContext } from 'react';
import { Accordion, Button, Container, HStack } from '@chakra-ui/react';

import { AiFillPlusCircle } from 'react-icons/ai';

import Layer from './Layer';
import { GlobalContext, LayerType } from './GlobalContext';

function App() {
    const { getLayers, createLayer } = useContext(GlobalContext);

    const layers = getLayers();

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
            </HStack>
        </Container>
    );
}

export default App;
