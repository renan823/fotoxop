/*
Tranformação gamma.

T(z)  = C * z ^ G
*/
export class GammaTransform {
    public static execute(image: ImageData, G: number, C: number): ImageData {
        const result = new ImageData(image.width, image.height);
        result.data.set(image.data);

        const _gamma = (z: number): number => {
            return C * z ** G;
        };

        for (let i = 0; i < result.data.length; i += 4) {
            result.data[i] = _gamma(result.data[i]);
            result.data[i + 1] = _gamma(result.data[i + 1]);
            result.data[i + 2] = _gamma(result.data[i + 2]);
        }

        return result;
    }
}
