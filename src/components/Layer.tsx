/* eslint-disable no-unused-vars */
import { FC } from 'react';
import { AiFillCloseCircle, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';

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
import { LayerType } from '../GlobalContext';
import { UpDownType } from '../Commons';

interface LayerProps extends LayerType {
    index: number;
    allowMoveDown: boolean;
    allowMoveUp: boolean;
    onMove: (id: string, direction: UpDownType) => void;
    onRemove: (id: string) => void;
    onRename: (id: string, name: string) => void;
}

export const Layer: FC<LayerProps> = ({
    index,
    id,
    allowMoveDown,
    allowMoveUp,
    onMove,
    onRemove,
    onRename,
}) => {
    return (
        <AccordionItem>
            <AccordionButton _expanded={{ bg: 'pink.500', color: 'white' }}>
                <Editable
                    defaultValue={`Layer #${index + 1}`}
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
                    {allowMoveUp && allowMoveDown && (
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
