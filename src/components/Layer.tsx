/* eslint-disable no-unused-vars */
import { AiFillCloseCircle, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { FC, useEffect } from 'react';

import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Button,
    Editable,
    EditableInput,
    EditablePreview,
    HStack,
    IconButton,
} from '@chakra-ui/react';

import Gallery from './Gallery';
import { LayerType, UpDownType } from '../utils';

interface LayerProps extends LayerType {
    index: number;
    allowMoveDown: boolean;
    allowMoveUp: boolean;
    allowDelete: boolean;
    onMove: (id: string, direction: UpDownType) => void;
    onRemove: (id: string) => void;
    onRename: (id: string, name: string) => void;
}

export const Layer: FC<LayerProps> = ({
    index,
    id,
    allowMoveDown,
    allowMoveUp,
    allowDelete,
    onMove,
    onRemove,
    onRename,
}) => {
    const defaultLayerName = `Layer #${index + 1}`;

    useEffect(() => {
        onRename(id, defaultLayerName);
    }, []);

    return (
        <AccordionItem>
            <AccordionButton _expanded={{ bg: 'pink.500', color: 'white' }}>
                <Editable
                    defaultValue={defaultLayerName}
                    flex="1"
                    textAlign="left"
                    onChange={(e) => onRename(id, e)}
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                <HStack justify="flex-end" my="5">
                    {allowMoveUp && (
                        <IconButton
                            aria-label="move up"
                            colorScheme="pink"
                            icon={<AiOutlineArrowUp />}
                            onClick={() => onMove(id, 'up')}
                        />
                    )}
                    {allowMoveDown && (
                        <IconButton
                            aria-label="move down"
                            colorScheme="pink"
                            icon={<AiOutlineArrowDown />}
                            onClick={() => onMove(id, 'down')}
                        />
                    )}
                    {allowDelete && (
                        <Button
                            colorScheme="pink"
                            leftIcon={<AiFillCloseCircle />}
                            variant="solid"
                            onClick={() => onRemove(id)}
                        >
                            Remove
                        </Button>
                    )}
                </HStack>

                <Gallery layerIndex={index} />
            </AccordionPanel>
        </AccordionItem>
    );
};

export default Layer;
