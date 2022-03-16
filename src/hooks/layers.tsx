/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';

import { useGlobal } from '../GlobalContext';
import { CustomHook, LayerConfig, LayerType, UpDownType, getNewID } from '../utils';

export const useLayers: CustomHook<
    { initialAmount?: number },
    {
        layers: LayerType[];
        createLayer: () => void;
        removeLayer: (id: string) => void;
        moveLayer: (id: string, direction: UpDownType) => void;
        allowMoveLayer: (i: number, direction: UpDownType) => boolean;
        renameLayer: (id: string, value: string) => void;
    }
> = ({ initialAmount = 2 }) => {
    const [layers, setLayers] = useState<LayerConfig[]>([]);

    const { updateLayers } = useGlobal();

    useEffect(() => {
        updateLayers(layers);
    }, [layers]);

    useEffect(() => {
        for (let i = 0; i < initialAmount; i++) {
            createLayer();
        }
    }, [initialAmount]);

    const createLayer = () => setLayers((layers) => [...layers, { id: getNewID(), name: '' }]);

    const removeLayer = (id: string) => setLayers((layers) => layers.filter((l) => l.id !== id));

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

    const allowMoveLayer = (i: number, direction: UpDownType) => {
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
