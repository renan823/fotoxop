import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { ImageSelector } from "@/components/features/image/selector";
import { Image } from "lucide-react";
import { useImage } from "@/context/image";
import { ImageCanvas } from "./canvas";
import { ToneCurveTransformHandle } from "../transforms/tone-curve";
import { RotateTransformHandle } from "../transforms/rotate";
import { CropHandle } from "../transforms/crop";
import { TranslateHandle } from "../transforms/translation";

/*
Componente para exibir o canvas
com a imagem e adicionar um overlay sobre ele.

É no overlay que certas operação são sobrepostas
ao canvas para editar a imagem.
*/
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
        );
    }

    return (
        <div className="relative h-full w-full border-2">
            <ImageCanvas />
            <div className="pointer-events-none absolute inset-0">
                {transform === "rotate" && <RotateTransformHandle />}
                {transform === "curve" && <ToneCurveTransformHandle />}
                {transform === "crop" && <CropHandle />}
                {transform === "translate" && <TranslateHandle />}
            </div>
        </div>
    );
}
