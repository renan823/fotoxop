import { CropManager } from "@/lib/transforms";
import type { ImageTransform, Point } from "@/lib/types";
import { create } from "zustand";

/*
Estado do app.

Responsável por armazenar diversas informações
usandas na renderização e manipulação
da imagem.
*/

type ImageStore = {
    image: ImageData | null;
    preview: ImageData | null;
    transform: ImageTransform | null;
    rotation: number;
    frame: Point[];
	curvePoints: Point[];
	loading: boolean;

    setImage: (image: ImageData) => void;
    setTransform: (transform: ImageTransform | null) => void;
    setRotation: (r: number) => void;
    setFrame: (frame: Point[]) => void;
	setCurvePoints: (points: Point[]) => void;
	setLoading: (loading: boolean) => void;
    clean: () => void;
};

export const useImage = create<ImageStore>((set) => ({
    image: null,
    preview: null,
    transform: null,
    rotation: 0,
    frame: CropManager.init(),
	curvePoints: [],
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
    
	setLoading: (loading) => {
		set({ loading });
	},

	clean: () =>
        set({
            image: null,
            preview: null,
            transform: null,
        }),
}));
