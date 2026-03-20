import { useContainerSize } from "@/hooks/use-size";
import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { generateCropPoints, moveCropPoints } from "@/lib/crop";
import { useImage } from "@/store/image";
import { Item, ItemContent, ItemHeader, ItemTitle } from "@/components/ui/item";
import { Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Point } from "@/lib/types";

export function CropTransform() {
	const { transform, setTransform } = useImage();

	return (
		<Item variant="outline" className="w-full">
			<ItemHeader>
				<ItemTitle className="flex items-center gap-2">
					<Crop className="size-4" />
					Cortar
				</ItemTitle>
			</ItemHeader>

			<ItemContent className="space-y-4">
				<p className="text-sm text-muted-foreground">
					Recortar a imagem
				</p>
				<div className="flex justify-end pt-2">
					<Button
						onClick={() => setTransform(transform !== "crop" ? "crop" : null)}
						variant={transform !== "crop" ? "default" : "outline"}
					>
						{transform === "crop" ? "Feito" : "Aplicar"}
					</Button>
				</div>
			</ItemContent>
		</Item>
	)
}

export function CropHandle() {
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

	useEffect(() => {
		if (!svgRef.current) {
			return;
		}

		const svg = d3.select(svgRef.current);
		const drag = d3.drag<SVGCircleElement, Point>()
			.subject((_, d) => ({
				x: xScale(d.x),
				y: yScale(d.y)
			}))
			.on("drag", (event, d) => {
				const [mx, my] = d3.pointer(event, svgRef.current);
				setFrame(moveCropPoints(frame, d, mx, my, xScale, yScale));
			});

		svg.selectAll<SVGCircleElement, Point>("circle")
			.data(frame)
			.call(drag);
	}, [width, height])

	useEffect(() => setFrame(generateCropPoints()), []);

	return (
		<div
			ref={ref}
			className="w-full h-full z-10 bg-muted/50 pointer-events-auto"
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
		</div>
	)
}
