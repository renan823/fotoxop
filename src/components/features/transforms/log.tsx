import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useImage } from "@/context/image";
import { Sparkle } from "lucide-react";
import { toast } from "sonner";
import * as Comlink from "comlink";
import { useWorker } from "@/hooks/use-worker";

export function LogTransform() {
	const { image, setImage, setTransform } = useImage();

	const worker = useWorker()

	async function handleApply() {
		if (!image) {
			return;
		}

		try {
			setTransform("log");

			const result = await worker.ApplyLog(
				Comlink.transfer(image, [image.data.buffer]),
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
					Transformação Log
				</ItemTitle>
			</ItemHeader>

			<ItemContent className="space-y-4">
				<p className="text-sm text-muted-foreground">
					Transformação logarítmica para realçar regiões escuras.
				</p>
				<div className="flex justify-end pt-2">
					<Button
						onClick={handleApply}
						disabled={!image}
					>
						Aplicar
					</Button>
				</div>
			</ItemContent>
		</Item>
	)
}
