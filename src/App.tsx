import { ImageCanvas } from "@/components/features/image/canvas"
import { Toolbar } from "@/components/features/toolbar"
import { ImageHistogram } from "./components/features/image/histogram"

export function App() {
	return (
		<div className="flex w-screen h-screen">
			<div className="w-3/4 h-full p-4 flex justify-center items-center">
				<div className="w-[80%] h-full space-y-8 py-8">
					<div className="h-[80%] flex items-center">
						<ImageCanvas/>
					</div>
					<ImageHistogram/>
				</div>
			</div>
			<div className="w-1/4 h-full">
				<Toolbar/>
			</div>
		</div>
	)
}
