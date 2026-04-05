/*
Transformação de translação.

Move pixels usando os valores de translação
fornecidos (x e y).

Essa tranformação sozinha não cuida de pixels
faltantes - Antes de executar a transformação
é necessário avaliar se ela pode ser efetuada.
*/
export class TranslateTransform {
    public static execute(image: ImageData, tx: number, ty: number): ImageData {
        const result = new ImageData(image.width, image.height);

        for (let i = 0; i < image.height; i++) {
            for (let j = 0; j < image.width; j++) {
                const x = Math.floor(j - tx);
                const y = Math.floor(i - ty);

                if (x < 0 || y < 0 || x >= image.width || y >= image.height) {
                    continue;
                }

                const idx = (y * image.width + x) * 4;
                const tidx = (i * image.width + j) * 4;

                result.data[tidx] = image.data[idx];
                result.data[tidx + 1] = image.data[idx + 1];
                result.data[tidx + 2] = image.data[idx + 2];
                result.data[tidx + 3] = image.data[idx + 3];
            }
        }

        return result;
    }
}
