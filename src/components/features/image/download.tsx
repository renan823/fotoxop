import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useImage } from "@/context/image-context";
import { Download } from "lucide-react";
import { useState } from "react";

export function DownloadImage() {
	const { image } = useImage();

	const [name, setName] = useState("imagem");
	const [open, setOpen] = useState(false);

	function handleDownload() {
		if (!image) {
			return;
		}
		
		let path = name.split(".")[0];
		if (path.length === 0) {
			path = "imagem";
		}
		
		path += ".jpg";

		const canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;

		const ctx = canvas.getContext("2d")!;
		ctx.putImageData(image, 0, 0);

		canvas.toBlob(blob => {
			if (!blob) return;

			const url = URL.createObjectURL(blob);

			const a = document.createElement("a");
			a.href = url;
			a.download = path;
			a.click();

			URL.revokeObjectURL(url);
			
			setName("imagem");
			setOpen(false);
		}, "image/jpeg", 0.9);
	}
	
	if (!image) {
		return (<></>);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={<Button variant="outline" size="icon" />}>
				<Download />
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Baixar imagem</DialogTitle>
				</DialogHeader>
				<div className="space-y-2">
					<Label>Salvar como...</Label>
					<InputGroup>
						<InputGroupInput type="text" value={name} onChange={evt => setName(evt.target.value)} />
						<InputGroupAddon align="inline-end">
							<InputGroupText>.jpg</InputGroupText>
						</InputGroupAddon>
					</InputGroup>
				</div>
				<DialogFooter>
					<DialogClose>Cancelar</DialogClose>
					<Button onClick={handleDownload}>Baixar</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
