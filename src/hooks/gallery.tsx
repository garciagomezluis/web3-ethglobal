/* eslint-disable no-unused-vars */
import { useState } from 'react';

import {
    CustomHook,
    GalleryItem,
    HEIGHT_PX,
    ImageConfig,
    MAX_AMOUNT_IMAGES,
    WIDTH_PX,
    union,
    validImageDimension,
} from '../utils';

import useError from './error';

const checkDimensions = async (
    newFiles: File[],
    width: number = WIDTH_PX,
    height: number = HEIGHT_PX,
) => {
    const objectURLs = newFiles.map(URL.createObjectURL);
    const dimensionsChecks = objectURLs.map((obj) => validImageDimension(obj, width, height));
    const dimensionsOk = (await Promise.all(dimensionsChecks)).every((x) => x);

    if (!dimensionsOk) {
        throw new Error(`Images must all be of ${width}x${height}`);
    }

    return true;
};

const mergeFiles = (
    newFiles: File[],
    currentFiles: File[],
    maxAmountImages: number = MAX_AMOUNT_IMAGES,
) => {
    const mergedFiles: File[] = union(newFiles, currentFiles, 'name');

    if (mergedFiles.length > maxAmountImages) {
        throw new Error(`You can upload up to ${maxAmountImages} images by layer`);
    }

    return mergedFiles;
};

const getFilesToAdd = (currentFiles: File[], newFiles: File[], maxAmountImages: number) => {
    const newFilesNames = newFiles.map((file) => file.name);

    const mergedFiles = mergeFiles(newFiles, currentFiles, maxAmountImages) as File[];

    const filesToAdd = mergedFiles.filter((file) => newFilesNames.indexOf(file.name) !== -1);

    return filesToAdd;
};

const getNewGalleryItem = (file: File): GalleryItem => {
    return {
        id: Math.random().toString().substring(2),
        file,
        config: {
            name: file.name,
            usageType: 'atleast',
            usageValue: 1,
        },
    };
};

export const useGallery: CustomHook<
    {
        width?: number;
        height?: number;
        maxAmountImages?: number;
    },
    {
        items: GalleryItem[];
        push: (files: File[]) => void;
        remove: (id: string) => void;
        update: (id: string, config: ImageConfig) => void;
        pushEnabled: boolean;
    }
> = ({ width = WIDTH_PX, height = HEIGHT_PX, maxAmountImages = MAX_AMOUNT_IMAGES }) => {
    const [items, setItems] = useState<GalleryItem[]>([]);

    const { showError } = useError({ showErrorTitle: 'Try again' });

    const remove = (id: string) => {
        setItems([...items.filter((item) => id !== item.id)]);
    };

    const push = async (files: File[]) => {
        try {
            await checkDimensions(files, width, height);

            const currentFiles = items.map((item) => item.file);

            const filesToAdd = getFilesToAdd(currentFiles, files, maxAmountImages);

            setItems((items) => [...items, ...filesToAdd.map(getNewGalleryItem)]);
        } catch (error) {
            showError((error as Error).message);
        }
    };

    const update = (id: string, config: ImageConfig) => {
        const { name, usageType, usageValue } = config;

        setItems((items) => {
            return items.map((item) => {
                if (item.id !== id) return item;

                return {
                    ...item,
                    config: {
                        name,
                        usageType,
                        usageValue,
                    },
                };
            });
        });
    };

    return { items, push, remove, update, pushEnabled: items.length !== maxAmountImages };
};

export default useGallery;
