import type { Point, Scale } from "./types";

/*
Gera os pontos entre o começo e o fim da escala.
Depende do máximo de pontos especificado.
 */
export function generatePoints(n: number): Point[] {
	const A: Point = { id: 0, x: 5, y: 5 };
	const B: Point = { id: n - 1, x: 250, y: 250 };

	const points: Point[] = [A];

	for (let i = 0; i < n - 2; i++) {
		const t = i / (n - 2);
		points.push({
			id: i + 1,
			x: A.x + t * (B.x - A.x),
			y: A.y + t * (B.y - A.y),
		})
	}

	points.push(B);
	return points;
}

/*
Limita a movimentação de um ponto "esbarrando"
nos vizinhos.
Um ponto não pode ultrapassar seus vizinhos.
 */
function applyNeighboorsLimit(points: Point[], index: number, p: Point): Point {
	const tolerance = 1;

	const point = { ...p };
	const prev = points[index - 1];
	const next = points[index + 1];

	if (prev) {
		point.x = Math.max(point.x, prev.x + tolerance);
	}

	if (next) {
		point.x = Math.min(point.x, next.x - tolerance);
	}

	return point;
}

/*
Função que aplica movimentação do ponto que foi
arrastado, puxando um pouco seus vizinhos.
Limita a movimentação pelo tamanho da tela e
pelos vizinhso diretos.

Pra lidar corretamente, é necessário converter entre
a escala de cores e a escala real da tela.

A parte de "puxar" vizinhos próximos foi feita
com ajuda de IA.
 */
export function moveCurvePoints(
	points: Point[],
	d: Point,
	px: number,
	py: number,
	xScale: Scale,
	yScale: Scale,
): Point[] {
	// Pegar ponto atual
	const index = points.findIndex(p => p.id === d.id);
	if (index === -1) {
		return points;
	}
	
	if (px === undefined || py === undefined) {
		return points;
	}

	let point = {
		...points[index],
		x: xScale.invert(px),
		y: yScale.invert(py)
	};

	point.x = Math.max(0, Math.min(point.x, 255));
	point.y = Math.max(0, Math.min(point.y, 255));

	// Limitar até vizinhos
	point = applyNeighboorsLimit(points, index, point);

	// Puxar vizinhos um pouco pra suavizar
	const dy = point.y - points[index].y;
	const influence = 0.75;

	const updated = points.map((p, i) => {
		if (i === index) {
			return point;
		}

		const dist = Math.abs(i - index);
		const weight = Math.exp(-dist);

		const py = p.y + dy * influence * weight;

		return {
			...p,
			y: Math.max(0, Math.min(py, 255)),
		};
	});

	return updated;
}
/*
Função responsável pela interpolação de pontos.
Permite criar uma curva relativamente suave.

https://en.wikipedia.org/wiki/Catmull%E2%80%93Rom_spline
 */
function curveCatmullRom(p0: number, p1: number, p2: number, p3: number, t: number): number {
	const m0 = 2 * p1;
	const m1 = (-p0 + p2) * t;
	const m2 = (2 * p0 - 5 * p1 + 4 * p2 - p3) * Math.pow(t, 2);
	const m3 = (-p0 + 3 * p1 - 3 * p2 + p3) * Math.pow(t, 3);

	return 0.5 * (m0 + m1 + m2 + m3)
}

/*
Função que interpola os pontos gerando a taebla de correspondencia.
Usando a interpolação, cada valor de x é mapeado pra um de y
dentro do domínio 0-255.

Usa a função de interpolação Catmull-Rom pra gerar a tabela.
 */
export function interpolatePoints(points: Point[]): Uint8ClampedArray {
	const lookup = new Uint8ClampedArray(256);

	points = points.map(p => ({
		id: p.id,
		x: Math.round(p.x),
		y: p.y
	}));

	for (let x = 0; x < 256; x++) {
		let i = 0;
		while (i < points.length - 1 && x > points[i + 1].x) {
			i++;
		}

		const p0 = points[Math.max(0, i - 1)];
		const p1 = points[i];
		const p2 = points[Math.min(points.length - 1, i + 1)];
		const p3 = points[Math.min(points.length - 1, i + 2)];

		const dx = p2.x - p1.x;
		if (dx === 0) {
			lookup[x] = p1.y;
			continue;
		}

		const t = Math.max(0, Math.min(1, (x - p1.x) / dx));
		const y = curveCatmullRom(p0.y, p1.y, p2.y, p3.y, t);

		lookup[x] = Math.max(0, Math.min(255, Math.round(y)));
	}

	return lookup;
}
