import { useImage } from "@/context/image";
import type { Scale } from "@/lib/types";
import { useMemo } from "react";

interface ImageFrameProps {
    xScale: Scale;
    yScale: Scale;
}

export function ImageFrame({ xScale, yScale }: ImageFrameProps) {
    const { frame } = useImage();

    const lines = useMemo(() => {
        return [
            {
                x1: xScale(frame[0].x),
                y1: yScale(frame[0].y),
                x2: xScale(frame[1].x),
                y2: yScale(frame[0].y),
            },
            {
                x1: xScale(frame[1].x),
                y1: yScale(frame[0].y),
                x2: xScale(frame[1].x),
                y2: yScale(frame[1].y),
            },
            {
                x1: xScale(frame[1].x),
                y1: yScale(frame[1].y),
                x2: xScale(frame[0].x),
                y2: yScale(frame[1].y),
            },
            {
                x1: xScale(frame[0].x),
                y1: yScale(frame[1].y),
                x2: xScale(frame[0].x),
                y2: yScale(frame[0].y),
            },
        ];
    }, [frame, xScale, yScale]);

    return (
        <>
            {frame.map((p) => {
                const size = 16;

                const isLeft = p.x < frame[1].x;
                const isTop = p.y < frame[1].y;

                const x = xScale(p.x) - (isLeft ? 0 : size);
                const y = yScale(p.y) - (isTop ? size : 0);

                return (
                    <rect
                        key={p.id}
                        x={x}
                        y={y}
                        width={size}
                        height={size}
                        fill="yellow"
                        rx={3}
                        ry={3}
                        style={{ cursor: "pointer" }}
                    />
                );
            })}

            {lines.map((l, idx) => (
                <line
                    key={idx}
                    x1={l.x1}
                    y1={l.y1}
                    x2={l.x2}
                    y2={l.y2}
                    stroke="yellow"
                    strokeWidth={4}
                />
            ))}
        </>
    );
}
