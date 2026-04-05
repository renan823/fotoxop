import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useImage } from "@/context/image";
import { FlipHorizontal } from "lucide-react";
import * as Comlink from "comlink";
import { useWorker } from "@/hooks/use-worker";
import { toast } from "sonner";

export function InverseTransform() {
    const { image, setImage, setTransform, loading } = useImage();

    const worker = useWorker();

    async function handleApply() {
        if (!image) {
            return;
        }

        try {
            setTransform("inverse");

            const result = await worker.ApplyInverse(
                Comlink.transfer(image, [image.data.buffer])
            );

            setImage(result);
        } catch {
            toast.error("Algo deu errado");
        }
    }

    return (
        <Item variant="outline" className="w-full">
            <ItemHeader>
                <ItemTitle className="flex items-center gap-2">
                    <FlipHorizontal className="size-4" />
                    Transformação Inversa
                </ItemTitle>
            </ItemHeader>

            <ItemContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                    Transformação inversa na intensidade.
                </p>
                <div className="flex justify-end pt-2">
                    <Button onClick={handleApply} disabled={!image || loading}>
                        Aplicar
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
}
