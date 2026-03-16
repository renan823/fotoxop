import { useEffect, useRef, useState } from "react"

/*
Hook pra pegar o tamanho da tela, mesmo com
mudanças (resize).
 */
export function useContainerSize() {
	const ref = useRef<HTMLDivElement | null>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		const observer = new ResizeObserver(entries => {
			const rect = entries[0].contentRect;
			setSize({
				width: rect.width,
				height: rect.height
			})
		})

		observer.observe(ref.current);

		return () => observer.disconnect();
	}, [])

	return { ref, size };
}
