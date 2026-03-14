import { ImageCanvas } from "@/components/features/image-canvas"
import { Toolbar } from "@/components/features/toolbar"

export function App() {
	return (
		<div className="flex w-screen h-screen">
			<div className="w-3/4 h-full p-4 flex items-center">
				<ImageCanvas/>
			</div>
			<div className="w-1/4 h-full">
				<Toolbar/>
			</div>
		</div>
	)
}
