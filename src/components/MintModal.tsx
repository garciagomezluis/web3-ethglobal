import axios from 'axios';
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
import { useMoralis, useMoralisFile, useWeb3ExecuteFunction } from 'react-moralis';

import { abi } from '../../artifacts/contracts/LayeralizeFactoryContract.sol/LayeralizeFactoryContract.json';
import useError from '../hooks/error';

const CONTRACT_ADDRESS = '0x0BD6166f462896AeaC4ba5cABDbf2c2eDbDD076C';

function leftFillNum(num: number, targetLength: number) {
    return num.toString().padStart(targetLength, '0');
}

const createFolderIPFS = async (content: any) => {
    try {
        const res = await axios.post(
            'https://deep-index.moralis.io/api/v2/ipfs/uploadFolder',
            content,
            {
                headers: {
                    'X-API-Key': 'NNOI1SY6ieKzX3kBRjKHQNMunOVQ8oa66uaW4O18gu8Z2cizt6NNZctPlXPjdj4T',
                    'Content-Type': 'application/json',
                    'accept': 'application/json',
                },
            },
        );

        const exampleUri = res.data[0].path;

        return exampleUri.substr(exampleUri.indexOf('Qm'), 46);
    } catch (error) {
        console.log(error);
    }
};

const getMetadataERC1155 = (imageHash: string, attrs: any[], i: number) => {
    return {
        description: `Test collection. Layeralize. ETH GLOBAL 2022. Token #${i}`,
        external_url: 'https://github.com/garciagomezluis/web3-ethglobal',
        image: `ipfs://${imageHash}/images/${leftFillNum(i, 64)}.png`,
        name: `Layeralize ETH Global Collection #${i}`,
        attributes: attrs.map((attr: any) => {
            return {
                trait_type: attr.name,
                value: attr.value,
            };
        }),
    };
};

export const MintModal: FC<any> = ({ onClose, files, attrs }) => {
    const { error } = useMoralisFile();
    const { account } = useMoralis();

    const { showError } = useError({ showErrorTitle: 'Please, retry' });

    const { fetch } = useWeb3ExecuteFunction();

    const [uploading, setUploading] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);
    const [uploadingMetadata, setUploadingMetadata] = useState(false);
    const [makingTransaction, setMakingTransaction] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (done) {
            setUploadingImage(false);
            setUploadingMetadata(false);
            setMakingTransaction(false);
        }
    }, [done]);

    useEffect(() => {
        if (error) {
            showError(error.message);
        }
    }, [error]);

    const onMintConfirm = async () => {
        if (done) {
            setDone(false);

            return onClose();
        }

        setUploading(true);

        const ipfsCidImages = await uploadImages();

        const ipfsCidMetadata = await uploadMetadata(ipfsCidImages);

        setUploading(false);

        console.log(ipfsCidMetadata);

        setMakingTransaction(true);

        await fetch({
            params: {
                abi,
                contractAddress: CONTRACT_ADDRESS,
                functionName: 'createCollection',
                params: {
                    ipfsCID: ipfsCidMetadata,
                    amount: files.length,
                },
            },
        });

        setMakingTransaction(false);

        setDone(true);
    };

    const uploadImages = async () => {
        setUploadingImage(true);

        const ipfsContent = [];

        for (let i = 0; i < files.length; i++) {
            ipfsContent.push({
                path: `images/${leftFillNum(i, 64)}.png`,
                content: files[i],
            });
        }

        const ipfsCid = await createFolderIPFS(ipfsContent);

        setUploadingImage(false);

        return ipfsCid;
    };

    const uploadMetadata = async (ipfsCidImages: string) => {
        setUploadingMetadata(true);

        const ipfsContent = [];

        for (let i = 0; i < files.length; i++) {
            ipfsContent.push({
                path: `metadata/${leftFillNum(i, 64)}.json`,
                content: getMetadataERC1155(ipfsCidImages, attrs[i], i),
            });
        }

        const ipfsCid = await createFolderIPFS(ipfsContent);

        setUploadingMetadata(false);

        return ipfsCid;
    };

    return (
        <>
            <ModalHeader>Collection minting</ModalHeader>
            <ModalBody>
                <>
                    <VStack display={uploading || done ? 'flex' : 'none'} w="full">
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
                    <VStack display={uploading || done ? 'flex' : 'none'} mt="5" w="full">
                        <Text color="pink.500" fontWeight="bold" w="full">
                            Finally
                        </Text>
                        <List spacing={3} w="full">
                            <ListItem>
                                {(makingTransaction || done) && (
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
                <VStack display={!uploading && !done ? 'flex' : 'none'}>
                    <Text>
                        {files.length} images will integrate the collection. This might take a few
                        minutes. You will be required to sign a transaction as the last operation
                        with a network fee. Please, do not close the tab once confirmed.
                    </Text>
                    <Text mt="2">{account}</Text>
                </VStack>
            </ModalBody>

            <ModalFooter>
                <Button
                    colorScheme="pink"
                    isLoading={uploading}
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
