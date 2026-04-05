const resolution = 0.9;

export const ImageFormats: Record<string, string> = {
    "image/jpeg": "JPEG",
    "image/png": "PNG",
};

/*
Classe utilitária para fazer download
da imagem em um canvas.
O download pode ser feito em JPEG ou PNG.
*/
export class ImageDownloadManager {
    private canvas: HTMLCanvasElement;
    private path: string;
    private format: string;

    constructor(canvas: HTMLCanvasElement, filename: string, format: string) {
        if (!ImageFormats[format]) {
            throw new Error("Formato de imagem inválido");
        }

        this.canvas = canvas;
        this.path = this.validateName(filename);
        this.format = format;
    }

    public download() {
        this.canvas.toBlob(
            (blob) => {
                if (!blob) {
                    throw new Error("Falha ao salvar imagem");
                }

                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");

                a.href = url;
                a.download = this.path;
                a.click();

                URL.revokeObjectURL(url);
            },
            this.format,
            resolution
        );
    }

    private validateName(filename: string): string {
        let path = filename.split(".")[0];
        if (path.length === 0) {
            path = "imagem";
        }

        path += ".jpg";
        return path;
    }
}
