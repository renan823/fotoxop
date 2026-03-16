import { Button } from "@/components/ui/button";
import { useImage } from "@/context/image-context";
import { RefreshCcw } from "lucide-react";
import { useState } from "react";
import { ValueSlider } from "../utils";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";

export function RotateTransform() {
	const { transform, setTransform } = useImage();

	return (
		<Item variant="outline" className="w-full">
			<ItemHeader>
				<ItemTitle className="flex items-center gap-2">
					<RefreshCcw className="size-4" />
					Girar
				</ItemTitle>
			</ItemHeader>

			<ItemContent className="space-y-4">
				<p className="text-sm text-muted-foreground">
					Rotacionar imagem em torno do centro.
				</p>
				<div className="flex justify-end pt-2">
					<Button
						onClick={() => setTransform(transform !== "rotate" ? "rotate" : null)}
						variant={transform !== "rotate" ? "default" : "outline"}
					>
						{transform === "rotate" ? "Feito" : "Aplicar"} 
					</Button>
				</div>
			</ItemContent>
		</Item>
	)
}

export function RotateTransformHandle() {
	const [theta, setTheta] = useState(0);

	return (
		<div className="w-full h-full z-10 flex items-center justify-center pointer-events-auto">
			<div className="w-1/3 p-4 bg-muted/20">
				<ValueSlider
					min={-45}
					max={45}
					step={1}
					value={theta}
					setValue={setTheta}
				/>
			</div>
		</div>
	)
}
