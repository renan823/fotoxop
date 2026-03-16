/* eslint-disable react-refresh/only-export-components */
import { generateCropPoints } from "@/lib/crop";
import type { Point } from "@/lib/utils";
import { createContext, useContext, useState, type Dispatch, type ReactNode } from "react";

export type ImageTransform = "inverse" | "rotate" | "gamma" | "log" | "contrast" | "curve" | "crop";

type ImageContextType = {
	image: ImageData | null;
	setImage: (image: ImageData) => void;
	transform: ImageTransform | null;
	setTransform: (transform: ImageTransform | null) => void;
	frame: Point[]
	setFrame: Dispatch<React.SetStateAction<Point[]>>;
}

const ImageContext = createContext<ImageContextType | null>(null);

interface ImageProviderProps {
	children: ReactNode;
}

export function ImageProvider({ children }: ImageProviderProps) {
	const [image, setImage] = useState<ImageData | null>(null);
	const [transform, setTransform] = useState<ImageTransform | null>(null);
	const [frame, setFrame] = useState<Point[]>(generateCropPoints());
	
	return (
		<ImageContext.Provider value={{ image, setImage, transform, setTransform, frame, setFrame }}>
			{children}
		</ImageContext.Provider>
	)
}

export function useImage() {
	const ctx = useContext(ImageContext);
	if (ctx === null) {
		throw new Error("useImage must be used with ImageProvider");
	}
	
	return ctx;
}