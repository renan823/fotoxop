import { generateCropPoints } from "@/lib/crop";
import type { ImageTransform, Point } from "@/lib/types";
import { create } from "zustand";

type ImageStore = {
	image: ImageData | null;
	preview: ImageData | null;
	transform: ImageTransform | null;
	rotation: number;
	frame: Point[];
	curvePoints: Point[];

	setImage: (image: ImageData) => void;
	setTransform: (transform: ImageTransform | null) => void;
	setRotation: (r: number) => void;
	setFrame: (frame: Point[]) => void;
	setCurvePoints: (points: Point[]) => void;
	clean: () => void;
}

export const useImage = create<ImageStore>((set) => ({
	image: null,
	preview: null,
	transform: null,
	rotation: 0,
	frame: generateCropPoints(),
	curvePoints: [],
	
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
	
	clean: () => set({
		image: null,
		preview: null,
		transform: null,
	})
}))
