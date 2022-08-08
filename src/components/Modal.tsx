/* eslint-disable no-unused-vars */
import {
    Modal,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
} from '@chakra-ui/react';

import { FC, createContext, useContext, useState } from 'react';

type ModalConfigType = {
    element: FC<any> | null;
    props: any;
    locked?: boolean;
    title: string;
};

const ModalContext = createContext<{
    open: (modalConfig: ModalConfigType) => void;
    close: () => void;
}>({
    open: () => {},
    close: () => {},
});

export const useModal = () => {
    return useContext(ModalContext);
};

const defaultModalConfig: ModalConfigType = {
    element: null,
    props: {},
    locked: false,
    title: '',
};

export const ModalProvider: FC = ({ children }) => {
    const [{ element: Element, props, locked, title }, setModalConfig] =
        useState(defaultModalConfig);

    const { isOpen, onClose, onOpen } = useDisclosure();

    const open = ({ element, props, locked = false, title }: ModalConfigType) => {
        setModalConfig({
            locked,
            element,
            props,
            title,
        });
        onOpen();
    };

    const close = () => {
        setModalConfig(defaultModalConfig);
        onClose();
    };

    return (
        <ModalContext.Provider value={{ open, close }}>
            <Modal
                closeOnEsc={!locked}
                closeOnOverlayClick={!locked}
                isOpen={isOpen}
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{title}</ModalHeader>
                    <ModalCloseButton disabled={locked} />

                    {Element !== null && <Element {...props} />}
                </ModalContent>
            </Modal>
            {children}
        </ModalContext.Provider>
    );
};

export default ModalProvider;
