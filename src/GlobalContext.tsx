/* eslint-disable no-continue */
/* eslint-disable import/no-cycle */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import mergeImages from 'merge-images';
import { FC, createContext, useCallback, useContext, useEffect, useState } from 'react';
import {
    GlobalLayerConfig,
    ImageConfig,
    LayerConfig,
    TraitInfo,
    UsageType,
    getNewID,
} from './utils';

type GlobalContextType = {
    updateLayers: (layers: LayerConfig[]) => void;
    updateImage: (layerIndex: number, imageIndex: number, image: ImageConfig) => void;
    generateImages: () => Promise<{ images: string[]; traits: TraitInfo[][] }>;
    images: string[];
    traits: TraitInfo[][];
};

const defaultContext: GlobalContextType = {
    updateLayers: () => {},
    updateImage: () => {},
    generateImages: async () => {
        return { images: [], traits: [] };
    },
    images: [],
    traits: [],
};

const GlobalContext = createContext<GlobalContextType>(defaultContext);

export const useGlobal = () => {
    return useContext(GlobalContext);
};

const getBase64Image = async (combination: ImageConfig[]) => {
    const names = [...combination.map((image) => URL.createObjectURL(image.file))];

    return mergeImages(names);
};

const getLayersName = (layers: GlobalLayerConfig[], fn: (layer: GlobalLayerConfig) => boolean) => {
    return layers
        .filter(fn)
        .map((layer) => layer.name)
        .join(', ');
};

const noImageSet = (layer: GlobalLayerConfig) => layer.images.length === 0;

const noImageWithAtLeastOptionSet = (layer: GlobalLayerConfig) =>
    layer.images.every((image) => image.usageType !== 'atleast');

const hasImageWithoutNameSet = (layer: GlobalLayerConfig) =>
    layer.images.some((image) => image.name === '');

const removeItem = (arr: any[], i: number) => arr.splice(i, 1);

const getDistribution = (images: ImageConfig[][], percentages = false) => {
    const distribution: { [k: string]: number } = {};

    for (let i = 0; i < images.length; i++) {
        const image = images[i];

        for (let j = 0; j < image.length; j++) {
            const layer = image[j];

            distribution[layer.name] = (distribution[layer.name] || 0) + 1;
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
    layers: GlobalLayerConfig[],
    image: ImageConfig[],
    distribution: { [k: string]: number },
) => {
    return image.map((trait) => {
        return {
            name: layers.find((layer) => layer.images.find((image) => image.name === trait.name))
                ?.name,
            value: trait.name,
            usage: distribution[trait.name],
            id: getNewID(),
        } as TraitInfo;
    });
};

const combineLayers = (layersCopy: GlobalLayerConfig[], k: number, type: UsageType) => {
    const images = [];

    const currentLayer = layersCopy[k];

    for (let i = 0; i < currentLayer.images.length; i++) {
        // imagen de layer principal
        const currentImage = currentLayer.images[i];

        if (currentImage.usageType !== type) continue;

        while (currentImage.usageValue > 0) {
            // repeticiones de imagen
            const image = [];

            for (let j = 0; j < layersCopy.length; j++) {
                // otras layers

                if (j === k) {
                    image.push(currentImage);

                    currentImage.usageValue--;

                    continue;
                }

                const idx = Math.floor(Math.random() * layersCopy[j].images.length);

                const rndImage = layersCopy[j].images[idx];

                if (--rndImage.usageValue === 0 && rndImage.usageType !== 'atleast') {
                    removeItem(layersCopy[j].images, idx);
                }

                image.push(rndImage);
            }

            images.push(image);
        }

        if (currentImage.usageType !== 'atleast') {
            removeItem(currentLayer.images, i);
            --i;
        }
    }

    return images;
};

const combine = (layers: GlobalLayerConfig[]) => {
    const layersCopy = layers.map((layer) => {
        const images = layer.images.map((image) => {
            return { ...image };
        });

        return { ...layer, images };
    });

    let images: ImageConfig[][] = [];

    for (let i = 0; i < layersCopy.length; i++) {
        images = [...images, ...combineLayers(layersCopy, i, 'exact')];
    }

    for (let i = 0; i < layersCopy.length; i++) {
        images = [...images, ...combineLayers(layersCopy, i, 'atleast')];
    }

    return images;
};

export const GlobalProvider: FC = ({ children }) => {
    const [layersConfig, setLayersConfig] = useState<GlobalLayerConfig[]>([]);

    const [images, setImages] = useState<string[]>([]);
    const [traits, setTraits] = useState<TraitInfo[][]>([]);

    useEffect(() => {
        setImages([]);
        setTraits([]);
    }, [layersConfig]);

    const updateLayers = (newLayers: LayerConfig[]) => {
        setLayersConfig((prevLayersConfig) => {
            const layers = [];

            for (const newLayer of newLayers) {
                const { id } = newLayer;

                const oldLayer = prevLayersConfig.find((pl) => pl.id === id);

                const layer = { ...{ id: 0, name: '', images: [] }, ...oldLayer, ...newLayer };

                layers.push(layer);
            }

            return layers;
        });
    };

    const updateImage = (layerIndex: number, imageIndex: number, newImage: ImageConfig) => {
        setLayersConfig((prevLayersConfig) => {
            prevLayersConfig[layerIndex].images[imageIndex] = newImage;

            return [...prevLayersConfig];
        });
    };

    const removeImage = (layerIndex: number, imageIndex: number) => {
        setLayersConfig((prevLayersConfig) => {
            prevLayersConfig[layerIndex].images = prevLayersConfig[layerIndex].images.filter(
                (_, index) => index === imageIndex,
            );

            return [...prevLayersConfig];
        });
    };

    const generateImages = useCallback(async () => {
        if (images.length > 0 && traits.length > 0) return { images, traits };

        let failingLayers = getLayersName(layersConfig, noImageSet);

        if (failingLayers !== '') {
            throw new Error(
                `Please, check ${failingLayers}: Layers must have at least 1 image set.`,
            );
        }

        failingLayers = getLayersName(layersConfig, noImageWithAtLeastOptionSet);

        if (failingLayers !== '') {
            throw new Error(
                `Please, check ${failingLayers}: Layers must have at least 1 image with "At least" option set.`,
            );
        }

        failingLayers = getLayersName(layersConfig, hasImageWithoutNameSet);

        if (failingLayers !== '') {
            throw new Error(`Please, check ${failingLayers}: Images must have a trait set.`);
        }

        const combs = combine(layersConfig);

        const distribution = getDistribution(combs, true);

        const newImages = await Promise.all([...combs.map(getBase64Image)]);

        const newTraits = combs.map((comb) => getTraitInfo(layersConfig, comb, distribution));

        setImages(newImages);

        setTraits(newTraits);

        return { images: newImages, traits: newTraits };
    }, [layersConfig, images, traits]);

    return (
        <GlobalContext.Provider
            value={{
                updateLayers,
                updateImage,
                generateImages,
                images,
                traits,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
