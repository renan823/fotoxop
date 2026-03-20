import { useMemo } from "react";
import { ChartContainer } from "@/components/ui/chart";
import { useImage } from "@/store/image";
import { Bar, BarChart } from "recharts";
import { luminance } from "@/lib/utils";

/*
Componente que exibe o histograma de intensidade
de uma imagem.

A imagem é lida e convertida para luminância.
Os valores são armazenados nos bins e exobidos
em um gráfico de barras.
 */
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
			className="w-full h-20 border-2"
			config={{ count: { color: "var(--foreground)" } }}
		>
			<BarChart data={values}>
				<Bar dataKey="count" fill="var(--color-count)" />
			</BarChart>
		</ChartContainer>
	)
}
