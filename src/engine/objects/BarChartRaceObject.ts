import { KinetixObject } from "../Object";

interface DataPoint {
    year: number;
    values: Record<string, number>;
}

// Mock Data: Popular Social Networks (Simplified)
const MOCK_DATA: DataPoint[] = [
    { year: 2004, values: { "Facebook": 1, "MySpace": 5, "Friendster": 3, "Orkut": 2, "LinkedIn": 0.5 } },
    { year: 2005, values: { "Facebook": 5, "MySpace": 20, "Friendster": 5, "Orkut": 8, "LinkedIn": 2 } },
    { year: 2006, values: { "Facebook": 12, "MySpace": 50, "Friendster": 4, "Orkut": 15, "LinkedIn": 5, "Twitter": 0.1 } },
    { year: 2007, values: { "Facebook": 50, "MySpace": 80, "Friendster": 3, "Orkut": 25, "LinkedIn": 10, "Twitter": 5 } },
    { year: 2008, values: { "Facebook": 100, "MySpace": 75, "Friendster": 2, "Orkut": 40, "LinkedIn": 25, "Twitter": 20 } },
    { year: 2009, values: { "Facebook": 300, "MySpace": 60, "Friendster": 1, "Orkut": 50, "LinkedIn": 40, "Twitter": 50 } },
    { year: 2010, values: { "Facebook": 500, "MySpace": 40, "Instagram": 1, "Orkut": 45, "LinkedIn": 70, "Twitter": 100 } },
    { year: 2012, values: { "Facebook": 1000, "Instagram": 50, "Twitter": 200, "LinkedIn": 150, "Pinterest": 20 } },
    { year: 2015, values: { "Facebook": 1500, "Instagram": 400, "Twitter": 300, "LinkedIn": 300, "Pinterest": 100, "Snapchat": 100 } },
    { year: 2018, values: { "Facebook": 2200, "Instagram": 1000, "Twitter": 350, "LinkedIn": 500, "TikTok": 200, "Snapchat": 300 } },
    { year: 2020, values: { "Facebook": 2700, "Instagram": 1200, "TikTok": 700, "Twitter": 400, "LinkedIn": 700, "Snapchat": 400 } },
    { year: 2023, values: { "Facebook": 3000, "Instagram": 2000, "TikTok": 1600, "Twitter": 500, "LinkedIn": 900, "Snapchat": 750 } },
];

const COLORS: Record<string, string> = {
    "Facebook": "#1877F2",
    "MySpace": "#003399",
    "Friendster": "#CCCCCC",
    "Orkut": "#D6006D",
    "LinkedIn": "#0077B5",
    "Twitter": "#1DA1F2",
    "Instagram": "#E1306C",
    "Pinterest": "#BD081C",
    "Snapchat": "#FFFC00",
    "TikTok": "#000000"
};

export class BarChartRaceObject extends KinetixObject {
    maxBars: number = 8;
    data: DataPoint[] = MOCK_DATA;

    // Layout
    barHeight: number = 40;
    gap: number = 10;
    labelColor: string = "#333";
    valueColor: string = "#666";
    fontFamily: string = "Inter";

    constructor(id: string) {
        super(id, "BarChartRace");
        this.width = 600;
        this.height = 400;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        // 1. Time Interpolation
        // Map animation 'time' (ms) to 'Year' range
        // Provide a default duration if not set in timeline?
        // Let's assume the object spans the whole timeline or a fixed duration.
        // For simplicity: Map object duration (this.movement.duration usually?) to data range.

        // Actually this.animation.duration is usually entry animation.
        // We'll use the scene time relative to object start?
        // But KinetixObjects usually are property-state based...
        // For this specific object, "content" is animated by time.
        // Let's map 0 -> 10s (10000ms) to the data range for now.

        const totalDuration = 10000; // 10 seconds for the full race
        const progress = Math.min(Math.max(time / totalDuration, 0), 1);

        const startYear = this.data[0].year;
        const endYear = this.data[this.data.length - 1].year;
        const currentYear = startYear + (endYear - startYear) * progress;

        // 2. Interpolate Values
        // Find indices
        let prevIndex = 0;
        for (let i = 0; i < this.data.length - 1; i++) {
            if (this.data[i + 1].year > currentYear) {
                prevIndex = i;
                break;
            }
            if (i === this.data.length - 2) prevIndex = this.data.length - 2;
        }

        const prev = this.data[prevIndex];
        const next = this.data[prevIndex + 1];

        // Linear interpolation factor between two data points
        const t = (currentYear - prev.year) / (next.year - prev.year);

        // Collect all categories
        const currentValues: { label: string, value: number, color: string }[] = [];
        const allKeys = new Set([...Object.keys(prev.values), ...Object.keys(next.values)]);

        allKeys.forEach(key => {
            const v1 = prev.values[key] || 0;
            const v2 = next.values[key] || 0;
            const val = v1 + (v2 - v1) * t;
            if (val > 0) {
                currentValues.push({
                    label: key,
                    value: val,
                    color: COLORS[key] || "#999"
                });
            }
        });

        // 3. Rank
        currentValues.sort((a, b) => b.value - a.value);

        // Normalize for Width (Max value in visible set)
        const maxValue = currentValues[0]?.value || 100;

        // 4. Draw
        ctx.save();
        ctx.translate(this.x, this.y);
        // Clip?
        // ctx.beginPath(); ctx.rect(0, 0, this.width, this.height); ctx.clip();

        // Title / Year
        ctx.fillStyle = this.labelColor;
        ctx.font = `bold 60px ${this.fontFamily}`;
        ctx.textAlign = "right";
        ctx.textBaseline = "bottom";
        ctx.globalAlpha = 0.2;
        ctx.fillText(Math.floor(currentYear).toString(), this.width - 20, this.height - 20);
        ctx.globalAlpha = this.opacity;

        // Draw Bars
        const visibleBars = currentValues.slice(0, this.maxBars);

        // Note: Smooth Rank Interpolation is hard without persistent state for "previous Y".
        // For a simple "Race", strict sorting per frame causes jumping if values flip.
        // To make it smooth, we usually simply interpolate the VALUE, but the Y-POSITION swaps instantly.
        // However, with high FPS, it looks okay.
        // Implementing smooth position swap requires storing state, which KinetixObject stateless-draw doesn't natively support easily 
        // without an `update(dt)` method that persists.
        // Since `draw` is stateless (pure function of Time), strict sorting is the "correct" stateless way.
        // If we want smooth swap, we'd need to interpolate 'rank' which is discrete.
        // We'll stick to instantaneous swap for this MVP. It's standard for basic bar races.

        visibleBars.forEach((item, i) => {
            const y = i * (this.barHeight + this.gap) + 40; // Offset for header?

            // Width
            const w = (item.value / maxValue) * (this.width - 150); // Reserve space for labels

            // Draw Bar
            ctx.fillStyle = item.color;
            // Rounded corners
            ctx.beginPath();
            ctx.roundRect(0, y, w, this.barHeight, 4);
            ctx.fill();

            // Icon / Label inside or outside?
            // Label (Name)
            ctx.fillStyle = this.labelColor;
            ctx.font = `bold 14px ${this.fontFamily}`;
            ctx.textAlign = "right";
            ctx.textBaseline = "middle";
            ctx.fillText(item.label, -10, y + this.barHeight / 2);

            // Value
            ctx.fillStyle = this.valueColor;
            ctx.font = `12px ${this.fontFamily}`;
            ctx.textAlign = "left";
            ctx.fillText(Math.round(item.value).toLocaleString(), w + 10, y + this.barHeight / 2);
        });

        ctx.restore();
    }

    clone(): BarChartRaceObject {
        const clone = new BarChartRaceObject(`race-${Date.now()}`);
        clone.x = this.x + 20;
        clone.y = this.y + 20;
        clone.width = this.width;
        clone.height = this.height;
        return clone;
    }
}
