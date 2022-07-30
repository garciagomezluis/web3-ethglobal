/* eslint-disable no-unused-vars */
/* eslint-disable no-continue */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import mergeImages from 'merge-images';
import { useState } from 'react';

import { CustomHook, GalleryItem, LayerConfig, TraitInfo, UsageType, getNewID } from '../utils';

const getBase64Image = async (combination: GalleryItem[]) => {
    const names = [...combination.map((image) => URL.createObjectURL(image.file))];

    return mergeImages(names);
};

const getLayersName = (layers: LayerConfig[], fn: (layer: LayerConfig) => boolean) => {
    return layers
        .filter(fn)
        .map((layer) => layer.name)
        .join(', ');
};

const noImageSet = (layer: LayerConfig) => layer.images.length === 0;

const noImageWithAtLeastOptionSet = (layer: LayerConfig) =>
    layer.images.every((image) => image.config.usageType !== 'atleast');

const hasImageWithoutNameSet = (layer: LayerConfig) =>
    layer.images.some((image) => image.config.name === '');

const removeItem = (arr: any[], i: number) => arr.splice(i, 1);

const getDistribution = (images: GalleryItem[][], percentages = false) => {
    const distribution: { [k: string]: number } = {};

    for (let i = 0; i < images.length; i++) {
        const image = images[i];

        for (let j = 0; j < image.length; j++) {
            const layer = image[j];

            distribution[layer.config.name] = (distribution[layer.config.name] || 0) + 1;
        }
    }

    if (percentages) {
        for (const name in distribution) {
            distribution[name] = Math.round((distribution[name] * 100) / images.length);
        }
    }

    return distribution;
};

const getTraitInfo = (
    layers: LayerConfig[],
    image: GalleryItem[],
    distribution: { [k: string]: number },
) => {
    return image.map((trait) => {
        return {
            name: layers.find((layer) =>
                layer.images.find((image) => image.config.name === trait.config.name),
            )?.name,
            value: trait.config.name,
            usage: distribution[trait.config.name],
            id: getNewID(),
        } as TraitInfo;
    });
};

const combineLayers = (layersCopy: LayerConfig[], k: number, type: UsageType) => {
    const images = [];

    const currentLayer = layersCopy[k];

    for (let i = 0; i < currentLayer.images.length; i++) {
        // imagen de layer principal
        const currentImage = currentLayer.images[i];

        const { usageType } = currentImage.config;

        let { usageValue } = currentImage.config;

        if (usageType !== type) continue;

        while (usageValue > 0) {
            // repeticiones de imagen
            const image = [];

            for (let j = 0; j < layersCopy.length; j++) {
                // otras layers

                if (j === k) {
                    image.push(currentImage);

                    usageValue--;

                    continue;
                }

                const idx = Math.floor(Math.random() * layersCopy[j].images.length);

                const rndImage = layersCopy[j].images[idx];

                if (--rndImage.config.usageValue === 0 && rndImage.config.usageType !== 'atleast') {
                    removeItem(layersCopy[j].images, idx);
                }

                image.push(rndImage);
            }

            images.push(image);
        }

        if (usageType !== 'atleast') {
            removeItem(currentLayer.images, i);
            --i;
        }
    }

    return images;
};

const combine = (layers: LayerConfig[]) => {
    // @ts-ignore
    const layersCopy = structuredClone(layers);

    let images: GalleryItem[][] = [];

    for (let i = 0; i < layersCopy.length; i++) {
        images = [...images, ...combineLayers(layersCopy, i, 'exact')];
    }

    for (let i = 0; i < layersCopy.length; i++) {
        images = [...images, ...combineLayers(layersCopy, i, 'atleast')];
    }

    return images;
};

export interface CombinationType {
    images: string[];
    traits: TraitInfo[][];
}

export const useCombinator: CustomHook<
    {},
    CombinationType & {
        generateImages: (layer: LayerConfig[]) => Promise<CombinationType>;
    }
> = () => {
    const [images, setImages] = useState<string[]>([]);
    const [traits, setTraits] = useState<TraitInfo[][]>([]);

    const generateImages = async (layers: LayerConfig[]) => {
        let newImages: string[] = [];
        let newTraits: TraitInfo[][] = [];

        if (layers.length > 0) {
            if (images.length > 0 && traits.length > 0) return { images, traits };

            let failingLayers = getLayersName(layers, noImageSet);

            if (failingLayers !== '') {
                throw new Error(
                    `Please, check ${failingLayers}: Layers must have at least 1 image set.`,
                );
            }

            failingLayers = getLayersName(layers, noImageWithAtLeastOptionSet);

            if (failingLayers !== '') {
                throw new Error(
                    `Please, check ${failingLayers}: Layers must have at least 1 image with "At least" option set.`,
                );
            }

            failingLayers = getLayersName(layers, hasImageWithoutNameSet);

            if (failingLayers !== '') {
                throw new Error(`Please, check ${failingLayers}: Images must have a trait set.`);
            }

            const combs = combine(layers);

            const distribution = getDistribution(combs, true);

            newImages = await Promise.all([...combs.map(getBase64Image)]);

            newTraits = combs.map((comb) => getTraitInfo(layers, comb, distribution));
        }

        setImages(newImages);

        setTraits(newTraits);

        return { images: newImages, traits: newTraits };
    };

    return { images, traits, generateImages };
};

export default useCombinator;
