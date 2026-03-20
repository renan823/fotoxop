import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useImage } from "@/store/image";
import { log } from "@/lib/transforms";
import { Sparkle } from "lucide-react";
import { toast } from "sonner";

export function LogTransform() {
	const { image, setImage, setTransform } = useImage();

	function handleApply() {
		if (!image) {
			return;
		}

		try {
			setTransform("log");
			setImage(log(image));
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
