import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useImage } from "@/context/image";
import { Trash } from "lucide-react";
import { useState } from "react";

/*
Componente que permite excluir a imagem
atualmente carregada no app.
*/
export function RemoveImage() {
    const { image, clean } = useImage();

    const [open, setOpen] = useState(false);

    function handleRemove() {
        clean();
        setOpen(false);
    }

    if (!image) {
        return <></>;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button variant="outline" size="icon" />}>
                <Trash />
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg">
                        Excluir imagem
                    </DialogTitle>
                    <DialogDescription>
                        Você tem certeza? Todas as modificações serão
                        perdidas!
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose render={<Button variant="ghost" />}>
                        Cancelar
                    </DialogClose>
                    <Button onClick={handleRemove}>Excluir</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
