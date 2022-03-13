/* eslint-disable import/no-cycle */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import { FC, createContext, useContext, useEffect, useState } from 'react';
import {
    checkAllImagesWithData,
    checkAtLeastByLayer,
    checkLayerCannotBeEmpty,
    getAllCombiations,
    getCombinationsData,
    getTraitInsights,
} from './Combinations';

import { UsageType } from './Commons';

export interface CombinationData extends ImageConfig {
    idx: number;
}

export type LayerType = {
    id: string;
};

type GlobalContextType = {
    updateLayers: (layers: LayerConfig[]) => void;
    updateImage: (layerIndex: number, imageIndex: number, image: ImageConfig) => void;
    calculateCombinations: () => boolean;
    combinations: CombinationData[][];
    generalError: string;
    insights: any;
};

const defaultContext: GlobalContextType = {
    updateLayers: () => {},
    updateImage: () => {},
    calculateCombinations: () => false,
    combinations: [],
    generalError: '',
    insights: {},
};

export const GlobalContext = createContext<GlobalContextType>(defaultContext);

export const useGlobalLayers = () => {
    const { updateLayers } = useContext(GlobalContext);

    return { updateLayers };
};

export const useGlobalImage = () => {
    const { updateImage } = useContext(GlobalContext);

    return { updateImage };
};

export type LayerConfig = {
    id: string;
    name: string;
};

export type ImageConfig = {
    file: File;
    name: string;
    usageType: UsageType;
    usageValue: number;
};

export type GlobalLayerConfig = LayerConfig & {
    images: ImageConfig[];
};

export const GlobalProvider: FC = ({ children }) => {
    const [layersConfig, setLayersConfig] = useState<GlobalLayerConfig[]>([]);

    const updateLayers = (newLayers: LayerConfig[]) =>
        setLayersConfig(
            newLayers.map((conf, i) => {
                return { ...{ id: 0, name: '', images: [] }, ...conf, ...newLayers[i] };
            }),
        );

    const updateImage = (layerIndex: number, imageIndex: number, newImage: ImageConfig) => {
        setLayersConfig((prevLayersConfig) => {
            prevLayersConfig[layerIndex].images[imageIndex] = newImage;

            return prevLayersConfig;
        });
    };

    const [combinations, setCombinations] = useState<CombinationData[][]>([]);
    const [generalError, setGeneralError] = useState('');
    const [insights, setInsights] = useState({});

    useEffect(() => {
        setCombinations([]);
        setGeneralError('');
        setInsights({});
    }, [layersConfig]);

    const calculateCombinations = () => {
        // validations
        // layers cannot be empty

        const failingEmpty = checkLayerCannotBeEmpty(layersConfig);

        if (failingEmpty.length !== 0) {
            setGeneralError(
                `Please, check layers ${failingEmpty.join(
                    ', ',
                )}: You need at least 1 image per layer.`,
            );

            return false;
        }

        // all layers must have at least one image with "at least" option set

        const failingAtLeast = checkAtLeastByLayer(layersConfig);

        if (failingAtLeast.length !== 0) {
            setGeneralError(
                `Please, check layers ${failingAtLeast.join(
                    ', ',
                )}: All layers must have at least 1 image with "At least" option set.`,
            );

            return false;
        }

        // all images must have a trait description

        const failingData = checkAllImagesWithData(layersConfig);

        if (failingData.length > 0) {
            setGeneralError(
                `Please, check layers ${failingData.join(
                    ', ',
                )}: All images must have the trait description set.`,
            );

            return false;
        }

        const combs = getAllCombiations(layersConfig);

        setCombinations(getCombinationsData(combs, layersConfig));

        setInsights(getTraitInsights(combs, layersConfig));

        return true;
    };

    return (
        <GlobalContext.Provider
            value={{
                updateLayers,
                updateImage,
                calculateCombinations,
                combinations,
                generalError,
                insights,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
