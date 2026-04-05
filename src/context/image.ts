import { CropManager } from "@/lib/transforms";
import type { ImageTransform, Point, Vec2 } from "@/lib/types";
import { create } from "zustand";

/*
Estado do app.

Responsável por armazenar diversas informações
usandas na renderização e manipulação
da imagem.
*/

type ImageStore = {
    image: ImageData | null;
    transform: ImageTransform | null;
    rotation: number;
    frame: Point[];
    curvePoints: Point[];
    translation: Vec2;
    loading: boolean;

    setImage: (image: ImageData) => void;
    setTransform: (transform: ImageTransform | null) => void;
    setRotation: (r: number) => void;
    setFrame: (frame: Point[]) => void;
    setCurvePoints: (points: Point[]) => void;
    setTranslation: (value: Vec2 | ((prev: Vec2) => Vec2)) => void;
    setLoading: (loading: boolean) => void;
    clean: () => void;
};

export const useImage = create<ImageStore>((set) => ({
    image: null,
    transform: null,
    rotation: 0,
    frame: CropManager.init(),
    curvePoints: [],
    translation: { x: 0, y: 0 },
    loading: false,

    setImage: (img) => {
        set({ image: img });
    },

    setTransform: (transform) => {
        set({ transform });
    },

    setRotation: (rotation) => {
        set({ rotation });
    },

    setFrame: (frame) => {
        set({ frame });
    },

    setCurvePoints: (points) => {
        set({ curvePoints: points });
    },

    setTranslation: (value) => {
        set((state) => ({
            translation:
                typeof value === "function" ? value(state.translation) : value,
        }));
    },

    setLoading: (loading) => {
        set({ loading });
    },

    clean: () =>
        set({
            image: null,
            transform: null,
            rotation: 0,
            frame: CropManager.init(),
            curvePoints: [],
            translation: { x: 0, y: 0 },
            loading: false,
        }),
}));
