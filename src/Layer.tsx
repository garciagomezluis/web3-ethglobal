import { AiFillCloseCircle, AiOutlineArrowDown, AiOutlineArrowUp } from 'react-icons/ai';
import { FC, useContext } from 'react';

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
import { GlobalContext, LayerType } from './GlobalContext';

interface LayerProps extends LayerType {
    moveDownAllowed: boolean;
    moveUpAllowed: boolean;
}

export const Layer: FC<LayerProps> = ({ id, name, moveDownAllowed, moveUpAllowed, gallery }) => {
    const { setLayerName, removeLayer, moveLayer } = useContext(GlobalContext);

    return (
        <AccordionItem>
            <AccordionButton _expanded={{ bg: 'pink.500', color: 'white' }}>
                <Editable
                    defaultValue={name}
                    flex="1"
                    textAlign="left"
                    onChange={(e) => setLayerName(id, e)}
                >
                    <EditablePreview />
                    <EditableInput />
                </Editable>
                <AccordionIcon />
            </AccordionButton>
            <AccordionPanel pb={4}>
                <HStack justify="flex-end" my="5">
                    {moveUpAllowed && (
                        <IconButton
                            aria-label="move up"
                            colorScheme="pink"
                            icon={<AiOutlineArrowUp />}
                            onClick={() => moveLayer(id, 'up')}
                        />
                    )}
                    {moveDownAllowed && (
                        <IconButton
                            aria-label="move down"
                            colorScheme="pink"
                            icon={<AiOutlineArrowDown />}
                            onClick={() => moveLayer(id, 'down')}
                        />
                    )}
                    {moveUpAllowed && moveDownAllowed && (
                        <Button
                            colorScheme="pink"
                            leftIcon={<AiFillCloseCircle />}
                            variant="solid"
                            onClick={() => removeLayer(id)}
                        >
                            Remove
                        </Button>
                    )}
                </HStack>

                <Gallery id={id} images={gallery.images} />
            </AccordionPanel>
        </AccordionItem>
    );
};

export default Layer;
