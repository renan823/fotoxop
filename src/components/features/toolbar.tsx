import { useImage } from "@/context/image";
import { ModeToggle } from "@/components/theme-provider";
import { Separator } from "@/components/ui/separator";
import {
    Empty,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { FolderOpen } from "lucide-react";
import { TransformSettings } from "./transforms";
import { DownloadImage } from "./image/download";
import { RemoveImage } from "./image/remove";

/*
Barra de ferramentas do app.
*/
export function ToolbarContent() {
    const { image } = useImage();

    if (!image) {
        return (
            <div className="flex h-[90vh] w-full items-center justify-center">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <FolderOpen />
                        </EmptyMedia>
                        <EmptyTitle>
                            Selecione uma imagem para continuar
                        </EmptyTitle>
                    </EmptyHeader>
                </Empty>
            </div>
        );
    }

	return (
		<div className="space-y-8 px-4">
			<p className="font-semibold">
				Aplique transformações na imagem (cuidado, algumas não podem ser desfeitas!)
			</p>
			<TransformSettings />
		</div>
    )
}

export function Toolbar() {
    return (
        <div className="h-full w-full space-y-1 border-l-2 bg-sidebar">
            <div className="space-y-2 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">
                        Fotoxop
                    </h1>
                    <div className="flex gap-4">
                        <RemoveImage />
                        <DownloadImage />
                        <ModeToggle />
                    </div>
                </div>
                <Separator />
            </div>
            <ToolbarContent />
        </div>
    );
}
