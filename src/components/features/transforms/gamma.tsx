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
Componente para aplicar a transformação gamma.
Permite alterar os valores aplicados via input.
*/
export function GammaTransform() {
    const { image, setImage, setTransform, loading } = useImage();

    const worker = useWorker();

    const [G, setG] = useState(1);
    const [C, setC] = useState(1);

    async function handleApply() {
        if (!image) {
            return;
        }

        try {
            setTransform("gamma");

            const result = await worker.ApplyGamma(
                Comlink.transfer(image, [image.data.buffer]),
                G,
                C
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
                    Transformação Gamma
                </ItemTitle>
            </ItemHeader>

            <ItemContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <span>Gamma</span>
                        <span className="text-muted-foreground">
                            {G.toFixed(2)}
                        </span>
                    </div>
                    <ValueSlider
                        max={2}
                        min={0}
                        step={0.1}
                        value={G}
                        setValue={setG}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <span>Constante (C)</span>
                        <span className="text-muted-foreground">
                            {C.toFixed(2)}
                        </span>
                    </div>
                    <ValueSlider
                        max={2}
                        min={0}
                        step={0.1}
                        value={C}
                        setValue={setC}
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
