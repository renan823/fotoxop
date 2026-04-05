import { type ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { useImage } from "@/context/image";
import { toast } from "sonner";
import { parseImage } from "@/lib/utils";

/*
Componente seletor da imagem.

O arquivo é lido como um ImageData.
Os dados da imagem são salvos no contexto global.
*/
export function ImageSelector() {
    const { setImage } = useImage();

    async function handleLoad(evt: ChangeEvent<HTMLInputElement>) {
        if (!evt.target.files || evt.target.files.length === 0) {
            return;
        }

        try {
            const file = evt.target.files[0];
            const image = await parseImage(file);

            setImage(image);
        } catch {
            toast.error("Erro ao carregar imagem");
        }
    }

    return (
        <div>
            <Input type="file" accept="image/*" onChange={handleLoad} />
        </div>
    );
}
