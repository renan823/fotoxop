import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useImage } from "@/context/image-context";
import { inverse } from "@/lib/transforms";
import { FlipHorizontal } from "lucide-react";
import { toast } from "sonner";

export function InverseTransform() {
	const { image, setImage, setTransform } = useImage();

	function handleApply() {
		if (!image) {
			return;
		}

		try {
			setTransform("inverse");
			setImage(inverse(image));
		} catch {
			toast.error("Algo deu errado")
		}
	}

	return (
		<Item variant="outline" className="w-full">
			<ItemHeader>
				<ItemTitle className="flex items-center gap-2">
					<FlipHorizontal className="size-4" />
					Transformação Inversa
				</ItemTitle>
			</ItemHeader>

			<ItemContent className="space-y-4">
				<p className="text-sm text-muted-foreground">
					Transformação inversa na intensidade.
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
