/* eslint-disable no-unused-vars */
import { AiFillCloseCircle, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { FC, useEffect } from 'react';

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

import Gallery from './Gallery';
import { LayerType } from '../utils';
import useLayers from '../hooks/layers';

const LayerName: FC<{ index: number; id: string }> = ({ index, id }) => {
    const { renameLayer } = useLayers({});

    const defaultLayerName = `Layer #${index + 1}`;

    useEffect(() => {
        console.log(id, defaultLayerName);
        renameLayer(id, defaultLayerName);
    }, []);

    // useEffect(() => {
    //     console.log(index, id);
    // }, [index, id]);

    return (
        <Editable
            defaultValue={defaultLayerName}
            flex="1"
            textAlign="left"
            onBlur={(e) => renameLayer(id, e.target.value)}
        >
            <EditablePreview />
            <EditableInput />
        </Editable>
    );
};

const LayerMenu: FC<{ index: number; id: string }> = ({ index, id }) => {
    const { layers, allowMoveLayer, moveLayer, removeLayer } = useLayers({});

    const allowMoveUp = allowMoveLayer(index, layers, 'up');
    const allowMoveDown = allowMoveLayer(index, layers, 'down');
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

interface LayerProps extends LayerType {
    index: number;
}

export const Layer: FC<LayerProps> = ({ index, id }) => {
    console.log(index, id);

    return (
        <AccordionItem>
            <AccordionButton _expanded={{ bg: 'pink.500', color: 'white' }}>
                <LayerName id={id} index={index} />
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                <Box my="5">
                    <LayerMenu id={id} index={index} />
                </Box>

                <Gallery layerIndex={index} />
            </AccordionPanel>
        </AccordionItem>
    );
};

export default Layer;
