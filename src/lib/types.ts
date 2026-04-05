import type { ScaleLinear } from "d3";

export type Point = {
    id: number;
    x: number;
    y: number;
};

export type Scale = ScaleLinear<number, number, never>;

export type ImageTransform =
    | "inverse"
    | "rotate"
    | "gamma"
    | "log"
    | "contrast"
    | "curve"
    | "crop"
    | "brightness"
    | "translate";

export type Vec2 = {
	x: number;
	y: number;
};
