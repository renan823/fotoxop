import type { Point, Scale } from "../types";

/*
Transformação de escala/corte.

Redimensiona a image usando os pontos
definidos pelo usuário no frame.
*/
export class CropTransform {
    public static execute(image: ImageData, frame: Point[]): ImageData {
        const { width, height, data } = image;

        const p1 = frame[0];
        const p2 = frame[1];

        const minX = Math.max(0, Math.floor(Math.min(p1.x, p2.x)));
        const maxX = Math.min(width, Math.ceil(Math.max(p1.x, p2.x)));

        const minY = Math.max(0, Math.floor(Math.min(p1.y, p2.y)));
        const maxY = Math.min(height, Math.ceil(Math.max(p1.y, p2.y)));

        const newWidth = maxX - minX;
        const newHeight = maxY - minY;

        if (newWidth <= 0 || newHeight <= 0) {
            return new ImageData(1, 1);
        }

        const newData = new Uint8ClampedArray(newWidth * newHeight * 4);

        for (let y = 0; y < newHeight; y++) {
            const srcY = y + minY;

            for (let x = 0; x < newWidth; x++) {
                const srcX = x + minX;

                const srcIdx = (srcY * width + srcX) * 4;
                const dstIdx = (y * newWidth + x) * 4;

                newData[dstIdx] = data[srcIdx];
                newData[dstIdx + 1] = data[srcIdx + 1];
                newData[dstIdx + 2] = data[srcIdx + 2];
                newData[dstIdx + 3] = data[srcIdx + 3];
            }
        }

        return new ImageData(newData, newWidth, newHeight);
    }
}

/*
Classe que agrupa rotinas usadas na manipulação
do rop na imagem.
*/
export class CropManager {
    /*
    Inicializa o frame de crop padrão,
    usando 100% do espaço (em escala) disponível.
    */
    public static init(): Point[] {
        return [
            { id: 0, x: 0, y: 0 },
            { id: 1, x: 100, y: 100 },
        ];
    }

    /*
    Move os pontos do frame de crop, respeitando
    os limites de borda.
    Também não permite que o ponto da esquerda
    passe para a direita, e vice-versa.
    */
    public static move(
        points: Point[],
        d: Point,
        px: number,
        py: number,
        xScale: Scale,
        yScale: Scale
    ): Point[] {
        if (points.length !== 2) {
            return points;
        }

        if (px === undefined || py === undefined) {
            return points;
        }

        const A = points.find((p) => p.id === d.id)!;
        const B = points.find((p) => p.id !== d.id)!;

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
        return points.map((p) => (p.id === d.id ? newA : p));
    }
}
