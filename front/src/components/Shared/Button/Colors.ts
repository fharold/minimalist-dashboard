export class ColorPair {
    public readonly bg: string;
    public readonly fg: string;

    constructor(bg: string, fg: string) {
        this.bg = bg;
        this.fg = fg;
    }
}

export default class Colors {
    static readonly green = new ColorPair("#3ec46d", "#FFFFFF");
    static readonly red = new ColorPair("#f03a5f", "#FFFFFF");
    static readonly yellow = new ColorPair("#ffdb4a", "#FFFFFF");
    static readonly blue = new ColorPair("#276cda", "#FFFFFF");
    static readonly black = new ColorPair("#000000", "#FFFFFF");
    static readonly white = new ColorPair("#FFFFFF", "#000000");
    static readonly light_grey = new ColorPair("#E0E0E0", "#000000");
}