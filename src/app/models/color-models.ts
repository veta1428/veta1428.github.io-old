export enum ColorModel {
    RGB = 1,
    HSV = 2,
    CMYK = 3,
}

export class RgbColor {
    public R: number;
    public G: number;
    public B: number;

    constructor(r: number, g: number, b: number) {
        this.R = r;
        this.G = g;
        this.B = b;
    }
}

export class CmykColor {
    constructor(c: number, m: number, y: number, k: number) {
        this.C = c;
        this.M = m;
        this.Y = y;
        this.K = k;
    }
    public C: number;
    public M: number;
    public Y: number;
    public K: number;
}

export class HsvColor {
    constructor(h: number, s: number, v: number) {
        this.S = s;
        this.V = v;
        this.H = h;
    }
    public H: number;
    public S: number;
    public V: number;
}