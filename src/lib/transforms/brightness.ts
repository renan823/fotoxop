/*
Transformação de brilho.

T(z) = v * z; 0 <= v <= 1
*/
export class BrightnessTransform {
	public static execute(image: ImageData, value: number): ImageData {
		const result = new ImageData(image.width, image.height);
		result.data.set(image.data);
		
		if (value > 1.0 || value < 0) {
			value = 1.0;
		}
		
        for (let i = 0; i < result.data.length; i += 4) {
            result.data[i] = value * result.data[i];
            result.data[i + 1] = value * result.data[i + 1];
			result.data[i + 2] = value * result.data[i + 2];
            result.data[i + 3] = value * result.data[i + 3];
        }
		
        return result;
    }
}