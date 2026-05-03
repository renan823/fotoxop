/*
FOTOXOP - App genérico de edição de imagens (Adobe não me processa)
Renan Trofino Silva - 15522316
BCC - 5° semestre
Profa. Leo Sampaio Ferraz Ribeiro
*/

import { Toolbar } from "@/components/features/toolbar"
import { ImageHistogram } from "@/components/features/image/histogram"
import { EditorScreen } from "@/components/features/image/screen"

export function App() {
	return (
		<div className="flex w-screen h-screen">
			<div className="w-3/4 h-full p-4 flex justify-center items-center">
				<div className="w-[80%] h-full space-y-8 py-8">
					<div className="h-[85%] flex items-center">
						<EditorScreen/>
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
