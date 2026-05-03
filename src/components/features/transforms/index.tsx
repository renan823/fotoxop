import { InverseTransform } from "./inverse";
import { RotateTransform } from "./rotate";
import { GammaTransform } from "./gamma";
import { LogTransform } from "./log";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContrastTransform } from "./contrast";
import { ToneCurveTransform } from "./tone-curve";
import { CropTransform } from "./crop";
import { BrightnessTransform } from "./brightness";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Ruler, WandSparkles } from "lucide-react";
import { TranslationTransform } from "./translation";

export function TransformSettings() {
    return (
        <Tabs defaultValue="geometric">
            <TabsList>
                <TabsTrigger value="geometric">
                    <Ruler />
                    Geométricas
                </TabsTrigger>
                <TabsTrigger value="intensity">
                    <WandSparkles />
                    Intensidade
                </TabsTrigger>
            </TabsList>
            <TabsContent value="geometric">
                <div className="space-y-4 pb-4">
                    <RotateTransform />
                    <CropTransform />
                    <TranslationTransform />
                </div>
            </TabsContent>
            <TabsContent value="intensity">
                <ScrollArea className="h-[75vh]">
                    <div className="space-y-4 pr-4 pb-4">
                        <ToneCurveTransform />
                        <InverseTransform />
                        <BrightnessTransform />
                        <GammaTransform />
						<LogTransform />
                        <BrightnessTransform/>
                        <ContrastTransform />
                    </div>
                </ScrollArea>
            </TabsContent>
        </Tabs>
    );
}
