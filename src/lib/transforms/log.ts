/*
Transformação log.

T(z) = C * log(1 + z)
*/
export class LogTransform {
    public static execute(image: ImageData): ImageData {
        const result = new ImageData(image.width, image.height);
        result.data.set(image.data);

        const C = 255 / Math.log(256);
        const _log = (z: number): number => {
            return C * Math.log(1 + z);
        };

        for (let i = 0; i < result.data.length; i += 4) {
            result.data[i] = _log(result.data[i]);
            result.data[i + 1] = _log(result.data[i + 1]);
            result.data[i + 2] = _log(result.data[i + 2]);
        }

        return result;
    }
}
