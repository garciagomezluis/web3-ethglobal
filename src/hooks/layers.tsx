/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

import { useGlobal } from '../GlobalContext';
import { CustomHook, LayerConfig, UpDownType, getNewID } from '../utils';

const getRawLayers = (amount: number = 1) => {
    return Array(amount)
        .fill({ name: '' })
        .map((e) => ({ id: getNewID(), ...e }));
};

export const useLayers: CustomHook<
    { initialAmount?: number },
    {
        layers: LayerConfig[];
        createLayer: () => void;
        removeLayer: (id: string) => void;
        moveLayer: (id: string, direction: UpDownType) => void;
        allowMoveLayer: (i: number, layers: LayerConfig[], direction: UpDownType) => boolean;
        renameLayer: (id: string, value: string) => void;
    }
> = ({ initialAmount = 2 }) => {
    const [layers, setLayers] = useState<LayerConfig[]>(() => getRawLayers(initialAmount));

    const { updateLayers } = useGlobal();

    useEffect(() => {
        console.log('amount', layers);
    }, []);

    useEffect(() => {
        console.log('layers', layers);
        updateLayers(layers);
    }, [layers]);

    const createLayer = (amount: number = 1) => {
        setLayers((layers) => [...layers, ...getRawLayers(amount)]);
    };

    const removeLayer = (id: string) => {
        setLayers((layers) => layers.filter((l) => l.id !== id));
    };

    const moveLayer = (id: string, direction: UpDownType) => {
        setLayers((prev) => {
            const aux = [...prev];

            for (let i = 0; i < aux.length; i++) {
                const j = direction === 'down' ? i + 1 : i - 1;

                if (aux[i].id === id) {
                    const auxA = aux[i];

                    aux[i] = aux[j];
                    aux[j] = auxA;

                    break;
                }
            }

            return [...aux];
        });
    };

    const allowMoveLayer = (i: number, layers: LayerConfig[], direction: UpDownType) => {
        if (direction === 'down') {
            return i < layers.length - 1;
        }

        return i > 0;
    };

    const renameLayer = (id: string, value: string) => {
        setLayers((prev) =>
            prev.map((layer) => {
                if (layer.id === id) {
                    layer.name = value;
                }

                return layer;
            }),
        );
    };

    return { layers, createLayer, removeLayer, moveLayer, allowMoveLayer, renameLayer };
};

export default useLayers;
