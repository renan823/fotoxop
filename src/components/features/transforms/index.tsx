import { InverseTransform } from "./inverse";
import { RotateTransform } from "./rotate";
import { GammaTransform } from "./gamma";
import { LogTransform } from "./log";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ContrastTransform } from "./contrast";
import { ToneCurveTransform } from "./tone-curve";

export function TransformSettings() {
	return (
		<ScrollArea className="h-[90vh]">
			<div className="space-y-4 px-4 pb-4">
				<RotateTransform />
				<ToneCurveTransform/>
				<InverseTransform />
				<GammaTransform />
				<LogTransform />
				<ContrastTransform/>
			</div>
		</ScrollArea>
	)
}
