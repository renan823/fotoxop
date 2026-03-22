import type { Point, Scale } from "./types";

export function generateCropPoints(): Point[] {
	return [
		{ id: 0, x: 0, y: 0 },
		{ id: 1, x: 100, y: 100 },
	]
}

export function moveCropPoints(
	points: Point[],
	d: Point,
	px: number,
	py: number,
	xScale: Scale,
	yScale: Scale,
): Point[] {
	if (points.length !== 2) {
		return points;
	}
	
	if (px === undefined || py === undefined) {
		return points;
	}
	
	const A = points.find(p => p.id === d.id)!;
    const B = points.find(p => p.id !== d.id)!;
	
	let newX = xScale.invert(px);
	let newY = yScale.invert(py);
	
    if (A.x < B.x) {
        newX = Math.min(newX, B.x - 1); 
    } else {
        newX = Math.max(newX, B.x + 1);
    }

    if (A.y > B.y) {
        newY = Math.max(newY, B.y + 1);
    } else {
        newY = Math.min(newY, B.y - 1);
	}
    
    const finalX = Math.max(0, Math.min(newX, 100));
    const finalY = Math.max(0, Math.min(newY, 100));

	const newA = { ...A, x: finalX, y: finalY };
    return points.map(p => p.id === d.id ? newA : p);
}
