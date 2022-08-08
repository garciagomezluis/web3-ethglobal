/* eslint-disable no-continue */
/* eslint-disable import/no-cycle */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import { FC, createContext, useContext, useEffect, useState } from 'react';
import { GalleryItem, LayerConfig, TraitInfo, UpDownType, getNewID } from './utils';

import useCombinator, { CombinationType } from './hooks/combinator';

type LayersContextType = {
    combineLayers: () => Promise<CombinationType>;
    updateLayerImages: (id: string, items: GalleryItem[]) => void;
    updateLayerName: (id: string, name: string) => void;
    allowMoveLayer: (id: string, direction: UpDownType) => boolean;
    moveLayer: (id: string, direction: UpDownType) => void;
    createLayer: () => void;
    removeLayer: (id: string) => void;
    reset: () => void;
    images: string[];
    traits: TraitInfo[][];
    files: File[];
    layers: LayerConfig[];
    dirty: boolean;
};

const defaultContext: LayersContextType = {
    combineLayers: async () => {
        return { images: [], traits: [] };
    },
    updateLayerImages: () => {},
    updateLayerName: () => {},
    allowMoveLayer: () => false,
    moveLayer: () => {},
    createLayer: () => {},
    removeLayer: () => {},
    reset: () => {},
    images: [],
    traits: [],
    files: [],
    layers: [],
    dirty: false,
};

const LayersContext = createContext<LayersContextType>(defaultContext);

export const useLayers = () => {
    return useContext(LayersContext);
};

function urltoFile(url: string, filename: string, mimeType = 'image/png') {
    return fetch(url)
        .then((res) => res.arrayBuffer())
        .then((buf) => new File([buf], filename, { type: mimeType }));
}

export const LayersProvider: FC = ({ children }) => {
    const [layersConfig, setLayersConfig] = useState<LayerConfig[]>([]);
    const [files, setFiles] = useState<File[]>([]);
    const { images, traits, generateImages } = useCombinator({});
    const [dirty, setDirty] = useState(false);

    useEffect(() => {
        generateImages([]);

        setDirty(layersConfig.some(({ images }) => images.length !== 0));
    }, [layersConfig]);

    useEffect(() => {
        const promises = images.map((e, i) => urltoFile(e, i.toString()));

        Promise.all(promises).then(setFiles);
    }, [images]);

    const combineLayers = () => {
        return generateImages(layersConfig);
    };

    const updateLayerImages = (id: string, items: GalleryItem[]) => {
        // @ts-ignore
        const newConfig = layersConfig.map((layerConfig) => {
            // @ts-ignore
            const layerCopy: LayerConfig = structuredClone(layerConfig);

            if (layerConfig.id !== id) return layerCopy;

            layerCopy.images = items;

            return layerCopy;
        });

        setLayersConfig(newConfig);
    };

    const updateLayerName = (id: string, name: string) => {
        // @ts-ignore
        const newConfig = layersConfig.map((layerConfig) => {
            // @ts-ignore
            const layerCopy: LayerConfig = structuredClone(layerConfig);

            if (layerConfig.id !== id) return layerCopy;

            layerCopy.name = name;

            return layerCopy;
        });

        setLayersConfig(newConfig);
    };

    const createLayer = () => {
        setLayersConfig((layers) => [
            ...layers,
            {
                id: getNewID(),
                name: `Layer #${layers.length + 1}`,
                images: [],
            },
        ]);
    };

    const reset = () => {
        setLayersConfig([]);
        createLayer();
        createLayer();
    };

    const removeLayer = (id: string) => {
        setLayersConfig((layers) => layers.filter((l) => l.id !== id));
    };

    const moveLayer = (id: string, direction: UpDownType) => {
        // @ts-ignore
        const layersCopy: LayerConfig[] = structuredClone(layersConfig);

        for (let i = 0; i < layersCopy.length; i++) {
            if (layersCopy[i].id === id) {
                const pos = i + (direction === 'up' ? -1 : 1);
                const item = layersCopy[pos];

                layersCopy[pos] = layersCopy[i];
                layersCopy[i] = item;

                break;
            }
        }

        setLayersConfig(layersCopy);
    };

    const allowMoveLayer = (id: string, direction: UpDownType) => {
        const pos = direction === 'up' ? 0 : -1;

        return layersConfig.at(pos)?.id !== id;
    };

    return (
        <LayersContext.Provider
            value={{
                combineLayers,
                updateLayerImages,
                updateLayerName,
                allowMoveLayer,
                moveLayer,
                createLayer,
                removeLayer,
                reset,
                images,
                traits,
                files,
                layers: layersConfig,
                dirty,
            }}
        >
            {children}
        </LayersContext.Provider>
    );
};

export default LayersProvider;
