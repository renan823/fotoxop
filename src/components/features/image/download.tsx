import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useImage } from "@/context/image";
import { ImageDownloadManager, ImageFormats } from "@/lib/download";
import { Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/*
Componente para download da imagem.
Usa o estado atual do app, e permite
escolher o formato de download.
*/
export function DownloadImage() {
    const { image } = useImage();

    const [name, setName] = useState("imagem");
    const [format, setFormat] = useState("image/jpeg");
    const [open, setOpen] = useState(false);

    function handleDownload() {
        if (!image) {
            return;
        }

        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const ctx = canvas.getContext("2d")!;
        ctx.putImageData(image, 0, 0);

        try {
            const manager = new ImageDownloadManager(canvas, name, format);
            manager.download();
        } catch (err) {
			if (err instanceof Error) {
				toast.error(err.message);
			} else {
				toast.error("Falha ao salvar imagem");
            }
        } finally {
            setName("imagem");
            setOpen(false);
        }
    }

    if (!image) {
        return <></>;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" size="icon" />}>
                <Download />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg">Baixar imagem</DialogTitle>
                </DialogHeader>
                <div className="space-y-2">
                    <Label>Salvar como...</Label>
                    <div className="flex gap-4">
                        <Input
                            type="text"
                            value={name}
                            onChange={(evt) => setName(evt.target.value)}
                        />
                        <FormatSelector format={format} setFormat={setFormat} />
                    </div>
                </div>
                <DialogFooter>
					<DialogClose render={<Button variant="ghost" />}>
						Cancelar
                    </DialogClose>
                    <Button onClick={handleDownload}>Baixar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

interface FormatSelectorProps {
    format: string;
    setFormat: (f: string) => void;
}

function FormatSelector({ format, setFormat }: FormatSelectorProps) {
    const items = Object.keys(ImageFormats).map((k) => ({
        label: ImageFormats[k],
        value: k,
    }));

    function onSelect(value: string | null) {
        if (value) {
            setFormat(value);
        }
    }

    return (
        <Select items={items} value={format} onValueChange={onSelect}>
            <SelectTrigger className="w-1/5">
                <SelectValue placeholder="Formato" />
            </SelectTrigger>
            <SelectContent className="w-1/5">
                <SelectGroup>
                    {items.map((item) => (
                        <SelectItem key={item.value} value={item.value}>
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    );
}
