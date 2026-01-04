import { KinetixObject } from "../Object";

export interface TextOptions {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    align: "left" | "center" | "right";
}

export class TextObject extends KinetixObject {
    text: string;
    fontSize: number;
    fontFamily: string;
    color: string;
    align: "left" | "center" | "right";

    constructor(id: string, options: Partial<TextOptions> = {}) {
        super(id, "Text");
        this.text = options.text || "Hello World";
        this.fontSize = options.fontSize || 40;
        this.fontFamily = options.fontFamily || "Inter";
        this.color = options.color || "#ffffff";
        this.align = options.align || "left";
        this.width = 300; // Auto-calc later? 
        this.height = 100;
    }

    draw(ctx: CanvasRenderingContext2D, time: number) {
        // --- Animation Logic ---
        let opacity = this.opacity;
        let y = this.y;
        let scale = 1;
        let textToDraw = this.text;

        if (this.animation.type !== "none") {
            const t = time - this.animation.delay;
            const progress = Math.max(0, Math.min(1, t / this.animation.duration));

            // Easing (easeOutCubic)
            const ease = 1 - Math.pow(1 - progress, 3);

            if (t < 0) {
                // Before animation starts
                opacity = 0;
            } else {
                switch (this.animation.type) {
                    case "fadeIn":
                        opacity = progress;
                        break;
                    case "slideUp":
                        opacity = progress;
                        y = this.y + (50 * (1 - ease));
                        break;
                    case "scaleIn":
                        scale = ease;
                        opacity = progress; // optional
                        break;
                    case "typewriter":
                        const charCount = Math.floor(this.text.length * progress);
                        textToDraw = this.text.slice(0, charCount);
                        break;
                }
            }
        }

        ctx.globalAlpha = opacity;

        ctx.font = `bold ${this.fontSize}px "${this.fontFamily}", sans-serif`;
        ctx.fillStyle = this.color;
        ctx.textAlign = this.align;
        ctx.textBaseline = "top";

        // Auto-measure text
        const metrics = ctx.measureText(this.text);
        this.width = metrics.width;
        // Approximation for height since actualBoundingBoxAscent can be flaky across browsers/fonts
        // or just use fontSize as a safe simple bounding box height for now
        this.height = this.fontSize;

        ctx.save();
        const cx = this.x + this.width / 2;
        const cy = this.y + this.height / 2;

        ctx.translate(cx, cy);
        ctx.rotate((this.rotation || 0) * Math.PI / 180);

        const animScale = scale;
        ctx.scale((this.scaleX || 1) * animScale, (this.scaleY || 1) * animScale);

        // Draw centered relative to the new origin
        // Since we translated to center, top-left is (-width/2, -height/2)
        // Adjust for animated Y offset
        const yOffset = y - this.y;

        ctx.fillText(textToDraw, -this.width / 2, -this.height / 2 + yOffset);

        ctx.restore();
    }

    clone(): TextObject {
        const clone = new TextObject(`text-${Date.now()}`, {
            text: this.text,
            fontSize: this.fontSize,
            fontFamily: this.fontFamily,
            color: this.color,
            align: this.align
        });
        clone.x = this.x + 20;
        clone.y = this.y + 20;
        return clone;
    }
}
