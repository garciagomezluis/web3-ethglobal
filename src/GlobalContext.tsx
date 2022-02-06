/* eslint-disable import/no-cycle */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
import { FC, PropsWithChildren, createContext, useEffect, useState } from 'react';
import {
    checkAllImagesWithData,
    checkAtLeastByLayer,
    checkLayerCannotBeEmpty,
    getAllCombiations,
    getCombinationsData,
    getTraitInsights,
} from './Combinations';

import { UpDownType, UsageType, getNewID } from './Commons';

interface GlobalProviderProps {}

interface CombinationData extends ImageViewerType {
    idx: number;
}

export type ImageViewerType = {
    file: File;
    traitValue: string;
    usageType: UsageType;
    usageValue: number;
};

export type GalleryType = {
    images: ImageViewerType[];
};

export type LayerType = {
    id: string;
    name: string;
    gallery: GalleryType;
};

type GlobalContextType = {
    createLayer: () => void;
    getLayers: () => LayerType[];
    setLayerName: (id: string, name: string) => void;
    removeLayer: (id: string) => void;
    moveLayer: (id: string, direction: UpDownType) => void;
    setFiles: (id: string, files: File[]) => void;
    removeFile: (id: string, file: File) => void;
    setFileTraitValue: (id: string, file: File, value: string) => void;
    setFileUsageType: (id: string, file: File, value: UsageType) => void;
    setFileUsageValue: (id: string, file: File, value: number) => void;
    calculateCombinations: () => boolean;
    combinations: CombinationData[][];
    generalError: string;
    insights: any;
};

const defaultContext: GlobalContextType = {
    createLayer: () => {},
    getLayers: () => [],
    setLayerName: () => {},
    removeLayer: () => {},
    moveLayer: () => {},
    setFiles: () => {},
    removeFile: () => {},
    setFileTraitValue: () => {},
    setFileUsageType: () => {},
    setFileUsageValue: () => {},
    calculateCombinations: () => false,
    combinations: [],
    generalError: '',
    insights: {},
};

export const GlobalContext = createContext<GlobalContextType>(defaultContext);

export const GlobalProvider: FC<PropsWithChildren<GlobalProviderProps>> = ({ children }) => {
    const [layers, setLayers] = useState<LayerType[]>([]);
    const [combinations, setCombinations] = useState<CombinationData[][]>([]);
    const [generalError, setGeneralError] = useState('');
    const [insights, setInsights] = useState({});

    useEffect(() => {
        setCombinations([]);
        setGeneralError('');
        setInsights({});
    }, [layers]);

    const createLayer = () => {
        setLayers((prev) => [
            ...prev,
            {
                id: getNewID(),
                name: `Layer name #${prev.length}`,
                gallery: { images: [] },
            },
        ]);
    };

    const getLayers = () => {
        return layers;
    };

    const setLayerName = (id: string, name: string) => {
        setLayers((prev) => {
            return prev.map((layer) => {
                if (layer.id === id) {
                    return {
                        ...layer,
                        name,
                    };
                }

                return layer;
            });
        });
    };

    const removeLayer = (id: string) => {
        setLayers((prev) => prev.filter((e) => e.id !== id));
    };

    const moveLayer = (id: string, direction: UpDownType) => {
        setLayers((prev) => {
            for (let i = 0; i < prev.length; i++) {
                const j = direction === 'down' ? i + 1 : i - 1;

                if (prev[i].id === id) {
                    const aux = prev[i];

                    prev[i] = prev[j];
                    prev[j] = aux;

                    break;
                }
            }

            return [...prev];
        });
    };

    const setFiles = (id: string, files: File[]) => {
        setLayers((prev) => {
            return prev.map((layer) => {
                if (layer.id === id) {
                    const nonLoadedFiles: File[] = files.filter((newFile) => {
                        return (
                            typeof layer.gallery.images.find(
                                ({ file }) => file.name === newFile.name,
                            ) === 'undefined'
                        );
                    });

                    const nonLoadedImages: ImageViewerType[] = nonLoadedFiles.map((f) => {
                        return {
                            file: f,
                            traitValue: '',
                            usageType: 'atleast',
                            usageValue: 1,
                        };
                    });

                    return {
                        ...layer,
                        gallery: {
                            images: [...layer.gallery.images, ...nonLoadedImages],
                        },
                    };
                }

                return layer;
            });
        });
    };

    const removeFile = (id: string, file: File) => {
        setLayers((prev) => {
            return prev.map((layer) => {
                if (layer.id === id) {
                    return {
                        ...layer,
                        gallery: {
                            images: layer.gallery.images.filter((i) => i.file.name !== file.name),
                        },
                    };
                }

                return layer;
            });
        });
    };

    const setFileTraitValue = (id: string, file: File, value: string) => {
        setLayers((prev) => {
            return prev.map((layer) => {
                if (layer.id === id) {
                    layer.gallery.images = layer.gallery.images.map((i) => {
                        if (i.file.name === file.name) {
                            i.traitValue = value;
                        }

                        return i;
                    });
                }

                return layer;
            });
        });
    };

    const setFileUsageType = (id: string, file: File, value: UsageType) => {
        setLayers((prev) => {
            return prev.map((layer) => {
                if (layer.id === id) {
                    layer.gallery.images = layer.gallery.images.map((i) => {
                        if (i.file.name === file.name) {
                            i.usageType = value;
                        }

                        return i;
                    });
                }

                return layer;
            });
        });
    };

    const setFileUsageValue = (id: string, file: File, value: number) => {
        setLayers((prev) => {
            return prev.map((layer) => {
                if (layer.id === id) {
                    layer.gallery.images = layer.gallery.images.map((i) => {
                        if (i.file.name === file.name) {
                            i.usageValue = value;
                        }

                        return i;
                    });
                }

                return layer;
            });
        });
    };

    const calculateCombinations = () => {
        // validations
        // layers cannot be empty

        const failingEmpty = checkLayerCannotBeEmpty(layers);

        if (failingEmpty.length !== 0) {
            setGeneralError(
                `Please, check layers ${failingEmpty.join(
                    ', ',
                )}: You need at least 1 image per layer.`,
            );

            return false;
        }

        // all layers must have at least one image with "at least" option set

        const failingAtLeast = checkAtLeastByLayer(layers);

        if (failingAtLeast.length !== 0) {
            setGeneralError(
                `Please, check layers ${failingAtLeast.join(
                    ', ',
                )}: All layers must have at least 1 image with "At least" option set.`,
            );

            return false;
        }

        // all images must have a trait description

        const failingData = checkAllImagesWithData(layers);

        if (Object.keys(failingData).length > 0) {
            setGeneralError(
                `Please, check layers ${Object.keys(failingData).join(
                    ', ',
                )}: All images must have the trait description set.`,
            );

            return false;
        }

        const combs = getAllCombiations(layers);

        setCombinations(getCombinationsData(combs, layers));

        setInsights(getTraitInsights(combs, layers));

        return true;
    };

    return (
        <GlobalContext.Provider
            value={{
                createLayer,
                getLayers,
                setLayerName,
                removeLayer,
                moveLayer,
                setFiles,
                removeFile,
                setFileTraitValue,
                setFileUsageType,
                setFileUsageValue,
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
