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
import { FC, useState } from 'react';
import { HiArrowSmRight, HiCheck } from 'react-icons/hi';

import { abi } from '../../artifacts/contracts/LayeralizeFactoryContract.sol/LayeralizeFactoryContract.json';
import { useAccount } from 'wagmi';

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

    const go = async (...args: any[]) => {
        setDone(false);
        setDoing(true);

        const response = await job(...args);

        setDoing(false);
        setDone(true);

        return response;
    };

    return { go, done, doing };
};

const useTransaction = () => {
    const pushTransaction = async (cid: string, amount: number) => {
        // await fetch({
        //     params: {
        //         abi,
        //         contractAddress: CONTRACT_ADDRESS,
        //         functionName: 'createCollection',
        //         params: {
        //             ipfsCID: cid,
        //             amount,
        //         },
        //     },
        // });
    };

    return { pushTransaction };
};

const usePublish = () => {
    const { pushTransaction } = useTransaction();
    const images = useJob(pushImages);
    const metadata = useJob(pushMetadata);
    const transaction = useJob(pushTransaction);

    const publish = async (files: File[], attrs: any[]) => {
        const { filenames } = await images.go(files);

        const { cid } = await metadata.go(filenames, attrs);

        // await uploadTransaction(cid, files.length);
    };

    return {
        images,
        metadata,
        transaction,
        publish,
    };
};

export const MintModal: FC<any> = ({ onClose, files, attrs }) => {
    const { images, metadata, transaction, publish } = usePublish();

    const { go, done, doing } = useJob(publish);

    const { address } = useAccount();

    const { doing: uploadingImage } = images;
    const { doing: uploadingMetadata } = metadata;
    const { doing: uploadingTransaction } = transaction;

    const onMintConfirm = async () => {
        await go(files, attrs);

        onClose();
    };

    return (
        <>
            <ModalHeader>Collection minting</ModalHeader>
            <ModalBody>
                <>
                    <VStack display={doing || done ? 'flex' : 'none'} w="full">
                        <Text color="pink.500" fontWeight="bold" w="full">
                            Uploading resources
                        </Text>
                        <List mt="15px !important" spacing={3} w="full">
                            <ListItem>
                                {(uploadingImage || done) && (
                                    <ListIcon
                                        as={done ? HiCheck : HiArrowSmRight}
                                        color="pink.500"
                                    />
                                )}
                                Uploading images to IPFS
                            </ListItem>
                            <ListItem>
                                {(uploadingMetadata || done) && (
                                    <ListIcon
                                        as={done ? HiCheck : HiArrowSmRight}
                                        color="pink.500"
                                    />
                                )}
                                Uploading NFTs metadata
                            </ListItem>
                        </List>
                    </VStack>
                    <VStack display={doing || done ? 'flex' : 'none'} mt="5" w="full">
                        <Text color="pink.500" fontWeight="bold" w="full">
                            Finally
                        </Text>
                        <List spacing={3} w="full">
                            <ListItem>
                                {(uploadingTransaction || done) && (
                                    <ListIcon
                                        as={done ? HiCheck : HiArrowSmRight}
                                        color="pink.500"
                                    />
                                )}
                                Transaction sign
                            </ListItem>
                        </List>
                    </VStack>
                </>
                <VStack display={!doing && !done ? 'flex' : 'none'}>
                    <Text>
                        {files.length} images will integrate the collection. This might take a few
                        minutes. You will be required to sign a transaction as the last operation
                        with a network fee. Please, do not close the tab once confirmed.
                    </Text>
                    <Text mt="2">{address}</Text>
                </VStack>
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
