import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { ImageSelector } from "@/components/features/image/selector";
import { Image } from "lucide-react";
import { useImage } from "@/context/image";
import { ImageCanvas } from "./canvas";
import { ToneCurveTransformHandle } from "../transforms/tone-curve";
import { RotateTransformHandle } from "../transforms/rotate";
import { CropHandle } from "../transforms/crop";

export function EditorScreen() {
    const { image, transform } = useImage();

    if (image === null) {
        return (
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Image />
                    </EmptyMedia>
                    <EmptyTitle>Nenhuma imagem carregada</EmptyTitle>
                    <EmptyDescription>
                        Selecione uma imagem para começar a editar
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <ImageSelector />
                </EmptyContent>
            </Empty>
        )
    }

    return (
        <div className="w-full h-full border-2 relative">
            <ImageCanvas />
            <div className="absolute inset-0 pointer-events-none">
                {transform === "rotate" && (<RotateTransformHandle />)}
                {transform === "curve" && (<ToneCurveTransformHandle />)}
                {transform === "crop" && (<CropHandle />)}
            </div>
        </div>
    )
}