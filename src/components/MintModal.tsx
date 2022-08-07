/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
import {
    Button,
    List,
    ListIcon,
    ListItem,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Text,
    VStack,
} from '@chakra-ui/react';
import { FC, useEffect, useState } from 'react';
import { HiArrowSmRight, HiCheck } from 'react-icons/hi';

import { abi } from '../../artifacts/contracts/LayeralizeFactoryContract.sol/LayeralizeFactoryContract.json';
import {
    useAccount,
    useContractWrite,
    usePrepareContractWrite,
    useWaitForTransaction,
} from 'wagmi';

const CONTRACT_ADDRESS = '0x0BD6166f462896AeaC4ba5cABDbf2c2eDbDD076C';

const pushImages = async (files: File[]) => {
    const formData = new FormData();

    for (const file of files) {
        formData.append(file.name, file);
    }

    const response = await fetch('https://lucho-nft.herokuapp.com/nft/images', {
        method: 'POST',
        body: formData,
    });

    return response.json();
};

const pushMetadata = async (filenames: string[], attrs: any[]) => {
    const metadata = filenames.map((filename, idx) =>
        getMetadataERC1155(filename, attrs[idx], idx),
    );

    const response = await fetch('https://lucho-nft.herokuapp.com/nft/metadata', {
        method: 'POST',
        body: JSON.stringify({
            metadata,
        }),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    return response.json();
};

const getMetadataERC1155 = (filename: string, attrs: any[], i: number) => {
    return {
        description: `Test collection. Layeralize. ETH GLOBAL 2022. Token #${i}`,
        external_url: 'https://github.com/garciagomezluis/web3-ethglobal',
        image: filename,
        name: `Layeralize ETH Global Collection #${i}`,
        attributes: attrs.map((attr: any) => {
            return {
                trait_type: attr.name,
                value: attr.value,
            };
        }),
    };
};

const useJob = (job: (...args: any[]) => any) => {
    const [doing, setDoing] = useState(false);
    const [done, setDone] = useState(false);
    const [data, setData] = useState(null);

    const go = async (...args: any[]) => {
        setDone(false);
        setDoing(true);

        setData(null);

        const response = await job(...args);

        setDoing(false);
        setDone(true);

        setData(response);

        return response;
    };

    return { go, done, doing, data };
};

const useContract = (cid: string | null, amount: number) => {
    const { config } = usePrepareContractWrite({
        addressOrName: CONTRACT_ADDRESS,
        contractInterface: abi,
        functionName: 'createCollection',
        enabled: cid !== null,
        args: [cid, amount],
    });

    const { write, data } = useContractWrite(config);

    const { isLoading, isSuccess, isError } = useWaitForTransaction({
        hash: data?.hash,
    });

    return { write, doing: isLoading, done: isSuccess || isError };
};

const usePublish = (files: File[], attrs: any[]) => {
    const images = useJob(pushImages);
    const metadata = useJob(pushMetadata);

    const publish = async () => {
        const { filenames } = await images.go(files);

        const { cid } = await metadata.go(filenames, attrs);

        return cid;
    };

    return {
        images,
        metadata,
        publish,
    };
};

const Item: FC<{ doing: boolean; done: boolean }> = ({ doing, done, children }) => {
    let Icon;

    if (doing) Icon = HiArrowSmRight;
    if (done) Icon = HiCheck;

    return (
        <ListItem>
            {Icon && <ListIcon as={Icon} color="pink.500" />}
            {children}
        </ListItem>
    );
};

const StepsView: FC<{
    images: any;
    metadata: any;
    tx: any;
}> = ({ images, metadata, tx }) => {
    const { doing: doingImages, done: doneImages } = images;
    const { doing: doingMetadata, done: doneMetadata } = metadata;
    const { doing: doingTx, done: doneTx } = tx;

    return (
        <>
            <VStack w="full">
                <Text color="pink.500" fontWeight="bold" w="full">
                    Uploading resources
                </Text>
                <List mt="15px !important" spacing={3} w="full">
                    <Item doing={doingImages} done={doneImages}>
                        Uploading images to IPFS
                    </Item>
                    <Item doing={doingMetadata} done={doneMetadata}>
                        Uploading NFTs metadata
                    </Item>
                </List>
            </VStack>
            <VStack mt="5" w="full">
                <Text color="pink.500" fontWeight="bold" w="full">
                    Finally
                </Text>
                <List spacing={3} w="full">
                    <Item doing={doingTx} done={doneTx}>
                        Transaction sign
                    </Item>
                </List>
            </VStack>
        </>
    );
};

export const MintModal: FC<any> = ({ onClose, files, attrs }) => {
    const { images, metadata, publish } = usePublish(files, attrs);

    const { go: push, done: doneUpload, doing: doingUpload, data: cid } = useJob(publish);

    const { write, done: doneTx, doing: doingTx } = useContract(cid, files.length);

    const { address } = useAccount();

    const doing = doingUpload || doingTx;
    const done = doneUpload || doneTx;

    const onMintConfirm = async () => {
        if (done) {
            onClose();

            return;
        }

        await push(files, attrs);
    };

    useEffect(() => {
        if (doneUpload && write) {
            write();
        }
    }, [write]);

    return (
        <>
            <ModalHeader>Collection minting</ModalHeader>
            <ModalBody>
                {(doing || done) && (
                    <StepsView
                        images={images}
                        metadata={metadata}
                        tx={{ doing: doingTx, done: doneTx }}
                    />
                )}
                {!(doing || done) && (
                    <VStack>
                        <Text>
                            {files.length} images will integrate the collection. This might take a
                            few minutes. You will be required to sign a transaction as the last
                            operation with a network fee. Please, do not close the tab once
                            confirmed.
                        </Text>
                        <Text mt="2">{address}</Text>
                    </VStack>
                )}
            </ModalBody>

            <ModalFooter>
                <Button
                    colorScheme="pink"
                    isLoading={doing}
                    loadingText="Loading"
                    onClick={onMintConfirm}
                >
                    {done ? 'Done' : 'Confirm'}
                </Button>
            </ModalFooter>
        </>
    );
};

export default MintModal;
