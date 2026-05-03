import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { Contrast } from "lucide-react";
import { RangeSlider } from "../utils";
import { useImage } from "@/context/image";
import { useState } from "react";
import { toast } from "sonner";
import * as Comlink from "comlink";
import { useWorker } from "@/hooks/use-worker";

/*
Componente para aplicar a transformação de contraste.
Permite alterar os ranges de valores via input.
*/
export function ContrastTransform() {
    const { image, setImage, setTransform, loading } = useImage();

    const [rangeA, setRangeA] = useState([10, 50]);
    const [rangeB, setRangeB] = useState([100, 150]);

    const worker = useWorker();

    async function handleApply() {
        if (!image) {
            return;
        }

        try {
            setTransform("contrast");

            const result = await worker.ApplyContrast(
                Comlink.transfer(image, [image.data.buffer]),
                rangeA,
                rangeB
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
                    <Contrast className="size-4" />
                    Transformação de Contraste
                </ItemTitle>
            </ItemHeader>

            <ItemContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <span>Faixa 1</span>
                        <span className="text-muted-foreground">
                            {rangeA.join(", ")}
                        </span>
                    </div>
                    <RangeSlider
                        max={255}
                        min={0}
                        step={1}
                        values={rangeA}
                        setValues={setRangeA}
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm font-medium">
                        <span>Faixa 2</span>
                        <span className="text-muted-foreground">
                            {rangeB.join(", ")}
                        </span>
                    </div>
                    <RangeSlider
                        max={255}
                        min={0}
                        step={1}
                        values={rangeB}
                        setValues={setRangeB}
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
