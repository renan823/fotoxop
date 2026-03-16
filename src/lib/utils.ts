import { clsx, type ClassValue } from "clsx"
import type { ScaleLinear } from "d3";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export type Point = {
	id: number;
	x: number;
	y: number;
}

export type Scale = ScaleLinear<number, number, never>;

/*
Função que converte um pixel RGB
para luminância.
 */
export function luminance(r: number, g: number, b: number): number {
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}