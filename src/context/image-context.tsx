/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, type ReactNode } from "react";

type ImageContextType = {
	image: ImageData | null;
	setImage: (image: ImageData) => void;
}

const ImageContext = createContext<ImageContextType | null>(null);

interface ImageProviderProps {
	children: ReactNode;
}

export function ImageProvider({ children }: ImageProviderProps) {
	const [image, setImage] = useState<ImageData | null>(null);
	
	return (
		<ImageContext.Provider value={{ image, setImage }}>
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