/*
Transformação de contraste.

T(z) = (z - a) * ((d - c) / (b - a)) + c
*/
export class ContrastTransform {
    public static execute(
        image: ImageData,
        rangeA: number[],
        rangeB: number[]
    ): ImageData {
        const result = new ImageData(image.width, image.height);
        result.data.set(image.data);

        const a = rangeA[0];
        const b = rangeB[1];
        const c = rangeB[0];
        const d = rangeB[1];

        const _contrast = (z: number): number => {
            return (z - a) * ((d - c) / (b - a)) + c;
        };

        for (let i = 0; i < result.data.length; i += 4) {
            result.data[i] = _contrast(result.data[i]);
            result.data[i + 1] = _contrast(result.data[i + 1]);
            result.data[i + 2] = _contrast(result.data[i + 2]);
        }

        return result;
    }
}
