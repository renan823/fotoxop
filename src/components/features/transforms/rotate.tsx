import { Button } from "@/components/ui/button";
import { useImage } from "@/context/image-context";
import { RefreshCcw } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ValueSlider } from "../utils";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { useContainerSize } from "@/hooks/use-size";
import * as d3 from "d3";
import { generateCropPoints } from "@/lib/crop";

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

	const { ref, size } = useContainerSize();
	const { frame, setFrame } = useImage();

	const svgRef = useRef<SVGSVGElement | null>(null);

	const width = size.width;
	const height = size.height;

	const xScale = useMemo(() => d3.scaleLinear().domain([0, 100]).range([0, width]), [width]);
	const yScale = useMemo(() => d3.scaleLinear().domain([0, 100]).range([height, 0]), [height]);

	const lines = useMemo(() => {
		return [
			{
				x1: xScale(frame[0].x), y1: yScale(frame[0].y),
				x2: xScale(frame[1].x), y2: yScale(frame[0].y),
			},
			{
				x1: xScale(frame[1].x), y1: yScale(frame[0].y),
				x2: xScale(frame[1].x), y2: yScale(frame[1].y),
			},
			{
				x1: xScale(frame[1].x), y1: yScale(frame[1].y),
				x2: xScale(frame[0].x), y2: yScale(frame[1].y),
			},
			{
				x1: xScale(frame[0].x), y1: yScale(frame[1].y),
				x2: xScale(frame[0].x), y2: yScale(frame[0].y),
			}
		]
	}, [frame, xScale, yScale])

	useEffect(() => setFrame(generateCropPoints()), []);

	return (
		<div
			ref={ref}
			className="w-full h-full z-10 flex justify-center items-center relative"
		>
			<svg ref={svgRef} width={width} height={height}>
				{frame.map((p) => (
					<circle
						key={p.id}
						cx={xScale(p.x)}
						cy={yScale(p.y)}
						r={6}
						fill="yellow"
					/>
				))}
				{lines.map((l, idx) => (
					<line
						key={idx}
						x1={l.x1} y1={l.y1}
						x2={l.x2} y2={l.y2}
						stroke="yellow" strokeWidth={2}
					/>
				))}
			</svg>
			<div className="absolute rounded-sm pointer-events-auto w-1/3 p-4 bg-muted/50 z-20 space-y-2">
				<div className="flex items-center justify-between text-sm font-medium">
					<span>Angulo</span>
					<span className="text-muted-foreground">{theta}</span>
				</div>
				<ValueSlider
					min={-45}
					max={45}
					step={1}
					value={theta}
					setValue={setTheta}
				/>
				<div className="flex justify-center">
					<Button>
						Rotacionar
					</Button>
				</div>
			</div>
		</div>
	)
}
