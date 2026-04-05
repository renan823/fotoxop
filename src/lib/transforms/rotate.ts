import type { Point } from "../types";
import { bilinearInterpolation } from "../utils";

/*
Transformação de rotação.

Aplica a rotação no centro da imagem
(translação antes e depois da rotação).

Para evitar buracos, uma escala é aplicada
para a imagem ocupar o espaço.
O preenchimento de alguns pixels é feito
interpoção bilinear.
*/
export class RotateTransform {
    public static execute(
        image: ImageData,
        deg: number,
        scale: number = 1
    ): ImageData {
        const angle = (deg * Math.PI) / 180;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const w = image.width;
        const h = image.height;

        const cx = w / 2;
        const cy = h / 2;

        const dst = new ImageData(w, h);
        const dstData = dst.data;

        for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
                // 1. centro
                const dx = x - cx;
                const dy = y - cy;

                // 2. rotação inversa
                const rx = dx * cos + dy * sin;
                const ry = -dx * sin + dy * cos;

                // 3. escala
                const sx = rx / scale;
                const sy = ry / scale;

                // 4. volta para imagem
                const srcX = sx + cx;
                const srcY = sy + cy;

                // 5. checagem de borda
                if (srcX < 0 || srcX >= w - 1 || srcY < 0 || srcY >= h - 1) {
                    continue; // deixa transparente
                }

                const color = bilinearInterpolation(image, srcX, srcY);

                const i = (y * w + x) * 4;
                dstData[i] = color[0];
                dstData[i + 1] = color[1];
                dstData[i + 2] = color[2];
                dstData[i + 3] = color[3];
            }
        }

        return dst;
    }
}

export class RotateManager {
    private static calcMaxFrame(w: number, h: number, angle: number) {
        const sin = Math.abs(Math.sin(angle));
        const cos = Math.abs(Math.cos(angle));

        const widthIsLonger = w >= h;

        const sideLong = widthIsLonger ? w : h;
        const sideShort = widthIsLonger ? h : w;

        let wr: number, hr: number;

        if (sideShort <= 2 * sin * cos * sideLong) {
            // caso limitado pelos cantos
            const x = 0.5 * sideShort;
            if (widthIsLonger) {
                wr = x / sin;
                hr = x / cos;
            } else {
                wr = x / cos;
                hr = x / sin;
            }
        } else {
            // caso geral
            const cos2 = cos * cos - sin * sin;
            wr = (w * cos - h * sin) / cos2;
            hr = (h * cos - w * sin) / cos2;
        }

        return { width: wr, height: hr };
    }

	public static calcFramePoints(imgW: number, imgH: number, deg: number): Point[] {
		const angle = Math.PI * deg / 180;
        const { width, height } = this.calcMaxFrame(imgW, imgH, angle);

        const cx = imgW / 2;
        const cy = imgH / 2;

		const p0 = {
			id: 0,
            x: cx - width / 2,
            y: cy - height / 2,
        };

		const p1 = {
			id: 1,
            x: cx + width / 2,
            y: cy + height / 2,
        };

        return [p0, p1];
    }
}
