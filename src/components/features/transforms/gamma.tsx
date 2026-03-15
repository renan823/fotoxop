import { Button } from "@/components/ui/button";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useImage } from "@/context/image-context";
import { gamma } from "@/lib/transforms";
import { Sparkle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { ValueSlider } from "../utils";

export function GammaTransform() {
	const { image, setImage, setTransform } = useImage();

	const [G, setG] = useState(1);
	const [C, setC] = useState(1);

	function handleApply() {
		if (!image) {
			return;
		}

		try {
			setTransform("gamma");
			setImage(gamma(image, G, C));
		} catch {
			toast.error("Algo deu errado");
		}
	}

	return (
		<Item variant="outline" className="w-full">
			<ItemHeader>
				<ItemTitle className="flex items-center gap-2">
					<Sparkle className="size-4" />
					Transformação Gamma
				</ItemTitle>
			</ItemHeader>

			<ItemContent className="space-y-4">
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm font-medium">
						<span>Gamma</span>
						<span className="text-muted-foreground">{G.toFixed(2)}</span>
					</div>
					<ValueSlider
						max={2}
						min={0}
						step={0.1}
						value={G}
						setValue={setG}
					/>
				</div>
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm font-medium">
						<span>Constante (C)</span>
						<span className="text-muted-foreground">{C.toFixed(2)}</span>
					</div>
					<ValueSlider
						max={2}
						min={0}
						step={0.1}
						value={C}
						setValue={setC}
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
