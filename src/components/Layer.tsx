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

const LayerName: FC<LayerType> = ({ id, name }) => {
    // TODO: validate empty layer name

    const { updateLayerName } = useLayers();

    return (
        <Editable
            submitOnBlur
            defaultValue={name}
            flex="1"
            textAlign="left"
            onSubmit={(e) => updateLayerName(id, e)}
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
                    icon={<AiOutlineArrowUp />}
                    onClick={() => moveLayer(id, 'up')}
                />
            )}
            {allowMoveDown && (
                <IconButton
                    aria-label="move down"
                    icon={<AiOutlineArrowDown />}
                    onClick={() => moveLayer(id, 'down')}
                />
            )}
            {allowDelete && (
                <Button leftIcon={<AiFillCloseCircle />} onClick={() => removeLayer(id)}>
                    Remove
                </Button>
            )}
        </HStack>
    );
};

interface LayerProps extends LayerType {}

export const Layer: FC<LayerProps> = ({ id, name }) => {
    return (
        <AccordionItem>
            <AccordionButton _expanded={{ bg: 'pink.500', color: 'white' }}>
                <LayerName id={id} name={name} />
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                <Box my="5">
                    <LayerMenu id={id} />
                </Box>

                <Gallery id={id} />
            </AccordionPanel>
        </AccordionItem>
    );
};

export default Layer;
