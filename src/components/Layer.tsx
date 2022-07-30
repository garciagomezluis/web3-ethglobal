import { FC } from 'react';
import { AiFillCloseCircle, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';

import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    Button,
    Editable,
    EditableInput,
    EditablePreview,
    HStack,
    IconButton,
} from '@chakra-ui/react';

import { LayerType } from '../utils';

import { useLayers } from '../LayersContext';

import Gallery from './Gallery';

const LayerName: FC<{ id: string }> = ({ id }) => {
    const { updateLayerName } = useLayers();

    return (
        <Editable
            defaultValue="default"
            flex="1"
            textAlign="left"
            onBlur={(e) => updateLayerName(id, e.target.value)}
        >
            <EditablePreview />
            <EditableInput />
        </Editable>
    );
};

const LayerMenu: FC<{ id: string }> = ({ id }) => {
    const { layers, allowMoveLayer, moveLayer, removeLayer } = useLayers();

    const allowMoveUp = allowMoveLayer(id, 'up');
    const allowMoveDown = allowMoveLayer(id, 'down');
    const allowDelete = layers.length !== 2;

    return (
        <HStack justify="flex-end">
            {allowMoveUp && (
                <IconButton
                    aria-label="move up"
                    colorScheme="pink"
                    icon={<AiOutlineArrowUp />}
                    onClick={() => moveLayer(id, 'up')}
                />
            )}
            {allowMoveDown && (
                <IconButton
                    aria-label="move down"
                    colorScheme="pink"
                    icon={<AiOutlineArrowDown />}
                    onClick={() => moveLayer(id, 'down')}
                />
            )}
            {allowDelete && (
                <Button
                    colorScheme="pink"
                    leftIcon={<AiFillCloseCircle />}
                    onClick={() => removeLayer(id)}
                >
                    Remove
                </Button>
            )}
        </HStack>
    );
};

interface LayerProps extends LayerType {}

export const Layer: FC<LayerProps> = ({ id }) => {
    return (
        <AccordionItem>
            <AccordionButton _expanded={{ bg: 'pink.500', color: 'white' }}>
                <LayerName id={id} />
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                <Box my="5">
                    <LayerMenu id={id} />
                </Box>

                <Gallery layerId={id} />
            </AccordionPanel>
        </AccordionItem>
    );
};

export default Layer;
