import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useImage } from "@/context/image";
import * as Comlink from "comlink";
import { Sparkle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ValueSlider } from "../utils";
import { useWorker } from "@/hooks/use-worker";

/*
Componente para aplicar a transformação de brilho.
Permite alterar o valor aplicado via input.
*/
export function BrightnessTransform() {
    const { image, setImage, setTransform, loading } = useImage();

    const worker = useWorker();

    const [value, setValue] = useState(1);

    async function handleApply() {
        if (!image) {
            return;
        }

        try {
            setTransform("brightness");

            const result = await worker.ApplyBrightness(
                Comlink.transfer(image, [image.data.buffer]),
                value,
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
                    <Sparkle className="size-4" />
                    Transformação de brilho
                </ItemTitle>
            </ItemHeader>

            <ItemContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <span>Valor</span>
                        <span className="text-muted-foreground">
                            {value.toFixed(2)}
                        </span>
                    </div>
                    <ValueSlider
                        max={1}
                        min={0}
                        step={0.05}
                        value={value}
                        setValue={setValue}
                    />
                </div>
                <div className="flex justify-end pt-2">
                    <Button onClick={handleApply} disabled={!image || loading}>
                        Aplicar
                    </Button>
                </div>
            </ItemContent>
        </Item>
    );
}
