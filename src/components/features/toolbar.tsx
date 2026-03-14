import { useImage } from "@/context/image-context";
import { ModeToggle } from "../theme-provider";
import { Separator } from "../ui/separator";
import { ImageHistogram } from "./image-histogram";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { FolderOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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
		<div className="space-y-4">
			<div className="space-y-1">
				<h4 className="font-semibold">Histograma da imagem</h4>
				<ImageHistogram/>
			</div>
		</div>
	)
}

export function Toolbar() {
	return (
		<div className="w-full h-full bg-sidebar border-l-2 p-4 space-y-4">
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<h1 className="scroll-m-20 text-3xl font-extrabold text-chart-1 tracking-tight text-balance">Fotoxop</h1>
					<ModeToggle />
				</div>
				<Separator />
			</div>
			<ToolbarContent />
		</div>
	)
}
