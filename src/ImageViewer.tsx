import { AiFillCloseCircle, AiFillEdit } from 'react-icons/ai';
import { FC, useContext, useEffect, useState } from 'react';

import {
    Alert,
    AlertIcon,
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    Image,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Select,
    Spacer,
    Text,
    VStack,
    useDisclosure,
} from '@chakra-ui/react';

import Stepper from './components/Stepper';

import { GlobalContext } from './GlobalContext';
import { HEIGHT_PX, UsageType, WIDTH_PX, getUsageText } from './Commons';

export interface ImageViewerProps {
    file: File;
    onRemove: any;
    id: string;
    traitValue: string;
    usageType: UsageType;
    usageValue: number;
}

const PropertiesModal: FC<any> = ({
    isOpen,
    onClose,
    onTraitChange,
    onUsageTypeChange,
    onUsageValueChange,
    usageType,
    usageValue,
    trait,
}) => {
    const [modalTrait, setModalTrait] = useState(trait);
    const [modalUsageType, setModalUsageType] = useState(usageType);
    const [modalUsageValue, setModalUsageValue] = useState(usageValue);

    const onSaveClick = () => {
        onTraitChange(modalTrait);
        onUsageTypeChange(modalUsageType);
        onUsageValueChange(modalUsageValue);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Trait properties</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                        <FormLabel>Trait</FormLabel>
                        <Input
                            placeholder="Blue Sky"
                            value={modalTrait}
                            onChange={(e) => setModalTrait(e.target.value)}
                        />
                    </FormControl>

                    <VStack align="flex-start" mt="5" w="full">
                        <Text>Usage</Text>
                        <HStack align="center" mt={4} w="full">
                            <Select
                                value={modalUsageType}
                                onChange={(e) => setModalUsageType(e.target.value)}
                            >
                                <option value="atleast">At least</option>
                                <option value="exact">Exact</option>
                                <option value="atmost">At most</option>
                            </Select>
                            <Spacer />
                            <Stepper initialValue={1} minValue={1} onChange={setModalUsageValue} />
                        </HStack>
                    </VStack>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme="pink" mr={3} onClick={onClose}>
                        Close
                    </Button>
                    <Button variant="ghost" onClick={onSaveClick}>
                        Save
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export const ImageViewer: FC<ImageViewerProps> = ({
    file,
    onRemove,
    id,
    traitValue,
    usageType,
    usageValue,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { setFileTraitValue, setFileUsageType, setFileUsageValue } = useContext(GlobalContext);

    const [showStateOk, setShowStateOk] = useState(false);

    useEffect(() => {
        if (traitValue !== '') {
            setShowStateOk(true);
        }
    }, [traitValue, usageType, usageValue]);

    return (
        <Box h={HEIGHT_PX} pos="relative" w={WIDTH_PX}>
            <PropertiesModal
                isOpen={isOpen}
                trait={traitValue}
                usageType={usageType}
                usageValue={usageValue}
                onClose={onClose}
                onTraitChange={(t: string) => setFileTraitValue(id, file, t)}
                onUsageTypeChange={(t: UsageType) => setFileUsageType(id, file, t)}
                onUsageValueChange={(t: number) => setFileUsageValue(id, file, t)}
            />
            <Image h={HEIGHT_PX} pos="absolute" src={URL.createObjectURL(file)} w={WIDTH_PX} />
            {showStateOk && (
                <Alert pos="absolute" status="success">
                    <AlertIcon />
                    {traitValue} - {getUsageText(usageType)} {usageValue}
                </Alert>
            )}
            <VStack
                _hover={{ opacity: '1' }}
                bg="rgba(100,100,100,.7)"
                h={HEIGHT_PX}
                justify="center"
                opacity="0"
                pos="absolute"
                transition="all 0.2s ease-in"
                w={WIDTH_PX}
            >
                <Button
                    colorScheme="pink"
                    leftIcon={<AiFillEdit />}
                    my="10px !important"
                    variant="solid"
                    w="70%"
                    onClick={onOpen}
                >
                    Edit properties
                </Button>
                <Button
                    colorScheme="pink"
                    leftIcon={<AiFillCloseCircle />}
                    my="10px !important"
                    variant="solid"
                    w="70%"
                    onClick={onRemove}
                >
                    Remove
                </Button>
            </VStack>
        </Box>
    );
};

export default ImageViewer;
