import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { Contrast } from "lucide-react";
import { RangeSlider } from "../utils";
import { useImage } from "@/store/image";
import { useState } from "react";
import { toast } from "sonner";
import { contrast } from "@/lib/transforms";

export function ContrastTransform() {
	const { image, setImage, setTransform } = useImage();

	const [rangeA, setRangeA] = useState([10, 50]);
	const [rangeB, setRangeB] = useState([100, 150]);

	function handleApply() {
		if (!image) {
			return;
		}

		try {
			setTransform("contrast");
			setImage(contrast(image, rangeA, rangeB));
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
						<span className="text-muted-foreground">{rangeA.join(", ")}</span>
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
						<span className="text-muted-foreground">{rangeB.join(", ")}</span>
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
