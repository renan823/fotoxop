import { useImage } from "@/context/image-context";
import { ModeToggle } from "../theme-provider";
import { Separator } from "../ui/separator";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { FolderOpen } from "lucide-react";
import { TransformSettings } from "./transforms";
import { DownloadImage } from "./image/download";

/*
Barra de ferramentas do app.
 */
export function ToolbarContent() {
	const { image } = useImage();

	if (!image) {
		return (
			<div className="w-full h-[90vh] flex justify-center items-center">
				<Empty>
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<FolderOpen />
						</EmptyMedia>
						<EmptyTitle>Selecione uma imagem para continuar</EmptyTitle>
					</EmptyHeader>
				</Empty>
			</div>
		)
	}

	return (
		<TransformSettings />
	)
}

export function Toolbar() {
	return (
		<div className="w-full h-full bg-sidebar border-l-2 space-y-4">
			<div className="space-y-2 p-4">
				<div className="flex items-center justify-between">
					<h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight text-balance">Fotoxop</h1>
					<div className="flex gap-4">
						<DownloadImage/>
						<ModeToggle />
					</div>
				</div>
				<Separator />
			</div>
			<ToolbarContent />
		</div>
	)
}
