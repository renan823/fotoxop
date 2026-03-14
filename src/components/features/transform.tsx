import { applyTranform, ImageTransforms } from "@/lib/processing"
import { Button } from "../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useMemo, useState } from "react"
import { Separator } from "../ui/separator";
import { useImage } from "@/context/image-context";
import { Play, Scan } from "lucide-react";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "../ui/empty";
import { toast } from "sonner";

export function TransformSettings() {
	const { image, setImage } = useImage();
	
	const [transformId, setTranformId] = useState<string | null>(null);
	
	const transform = useMemo(() => {
		if (!transformId) {
			return null;
		}
		
		if (ImageTransforms[transformId]) {
			return ImageTransforms[transformId];
		}
		
		return null;
	}, [transformId])
	
	function handleApply() {
		if (!transformId || !transform || !image) {
			return;
		}
		
		try {
			setImage(applyTranform(transformId, image));
		} catch {
			toast.error("Algo deu errado...");
		}
	}
	
	return (
		<div>
			<div className="my-4">
				<div className="flex justify-between items-center my-1">
					<p className="font-semibold font-md">Transformação</p>
					<TransformSelector setTransformId={setTranformId} />
				</div>
				<Separator />
			</div>
			
			<div className="my-4">
				{transform && (
					<div className="space-y-4">
						<div>
							<p className="text-md font-semibold">{transform.name}</p>
						</div>
						<div>
							
						</div>
						<div className="flex justify-end">
							<Button onClick={handleApply}>
								Aplicar
									<Play />
							</Button>
						</div>
					</div>
				)}
				{!transform && (
					<Empty>
						<EmptyHeader>
							<EmptyMedia>
								<Scan />
							</EmptyMedia>
							<EmptyTitle>Nenhuma trasnformação selecionada</EmptyTitle>
							<EmptyDescription>Selecione uma transformação...</EmptyDescription>
						</EmptyHeader>
					</Empty>
				)}
			</div>
		</div>
	)
}

interface TransformSelectorProps {
	setTransformId: (id: string) => void;
}

function TransformSelector({ setTransformId }: TransformSelectorProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className="w-1/2"
				render={
					<Button variant="outline" />
				}
			>
				Selecionar Transformação
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Intensidade</DropdownMenuLabel>
					{Object.values(ImageTransforms).filter(t => t.type === "intensity").map(t => {
						return (
							<DropdownMenuItem
								key={t.id}
								onClick={() => setTransformId(t.id)}
							>
								{t.name}
							</DropdownMenuItem>
						)
					})}
					<DropdownMenuSeparator />
				</DropdownMenuGroup>
				<DropdownMenuGroup>
					<DropdownMenuLabel>Geométrica</DropdownMenuLabel>
					{Object.values(ImageTransforms).filter(t => t.type === "geometric").map(t => {
						return (
							<DropdownMenuItem
								key={t.id}
								onClick={() => setTransformId(t.id)}
							>
								{t.name}
							</DropdownMenuItem>
						)
					})}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
