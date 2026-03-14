import { useMemo } from "react";
import { ChartContainer } from "../ui/chart";
import { useImage } from "@/context/image-context";
import { Bar, BarChart } from "recharts";
import { luminance } from "@/lib/utils";

export function ImageHistogram() {
	const { image } = useImage();

	const values = useMemo(() => {
		if (image === null) {
			return [];
		}

		const bins = new Uint32Array(256);
		for (let i = 0; i < image.data.length; i += 4) {
			// Calcular luminancia
			const lumi = luminance(
				image.data[i],
				image.data[i + 1],
				image.data[i + 2]
			)

			bins[Math.round(lumi)]++;
		}

		return Array.from(bins).map((count, value) => ({ count, value }));
	}, [image])


	if (image === null) {
		return (<></>);
	}

	return (
		<ChartContainer
			className="w-full h-20 border-2 bg-primary-foreground rounded-sm"
			config={{ count: { color: "var(--chart-2)" } }}
		>
			<BarChart data={values}>
				<Bar dataKey="count" fill="var(--color-count)" />
			</BarChart>
		</ChartContainer>
	)
}
