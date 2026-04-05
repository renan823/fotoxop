/*
Transformação inversa.

T(z) = 255 - z
*/
export class InverseTransform {
    public static execute(image: ImageData): ImageData {
        const result = new ImageData(image.width, image.height);
        result.data.set(image.data);

        for (let i = 0; i < result.data.length; i += 4) {
            result.data[i] = 255 - result.data[i];
            result.data[i + 1] = 255 - result.data[i + 1];
            result.data[i + 2] = 255 - result.data[i + 2];
        }

        return result;
    }
}
