import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "@/index.css"
import { App } from "@/App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { ImageProvider } from "@/context/image-context"
import { Toaster } from "@/components/ui/sonner"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<ThemeProvider>
			<ImageProvider>
				<App />
			</ImageProvider>
			<Toaster/>
		</ThemeProvider>
	</StrictMode>
)
