import { Injectable } from "@angular/core";
import { CmykColor, HsvColor, RgbColor } from "./models/color-models";

@Injectable({
    providedIn: 'root',
})
export class ColorService {

    constructor() { }

    public RgbToCmyk(rgb: RgbColor): CmykColor {
        let k = this.Min(1 - rgb.R / 255.0, 1 - rgb.G / 255.0, 1 - rgb.B / 255.0);

        if(k == 1)
        {
            return new CmykColor(0, 0, 0, 1);
        }

        let c = (1 - rgb.R / 255.0 - k) / (1 - k);
        let m = (1 - rgb.G / 255.0 - k) / (1 - k);
        let y = (1 - rgb.B / 255.0 - k) / (1 - k);

        return new CmykColor(c, m, y, k);
    }

    public CmykToRgb(cmyk: CmykColor): RgbColor {
        let r = 255 * (1 - cmyk.C) * (1 - cmyk.K);
        let g = 255 * (1 - cmyk.M) * (1 - cmyk.K);
        let b = 255 * (1 - cmyk.Y) * (1 - cmyk.K);

        return new RgbColor(r, g, b);
    }

    public RgbToHsv(rgb: RgbColor): HsvColor {
        let _r = rgb.R / 255;
        let _g = rgb.G / 255;
        let _b = rgb.B / 255;

        let cMax = this.Max(_r, _g, _b);
        let cMin = this.Min(_r, _g, _b);

        let delta = cMax - cMin;

        let h = 0;

        if (delta == 0)
            h = 0;
        else if (cMax == _r)
            h = 60 * ((_g - _b) / delta + 6);
        else if (cMax == _g)
            h = 60 * ((_b - _r) / delta + 2);
        else
            h = 60 * ((_r - _g) / delta + 4);

        if(h >= 360)
        {
            h -= 360;
        }

        let s = 0;

        if (cMax == 0)
            s = 0;
        else
            s = delta / cMax;

        return new HsvColor(h, s, cMax);
    }

    public HsvToRgb(hsv: HsvColor) : RgbColor
    {
        let c = hsv.V * hsv.S;
        let x = c * (1 - Math.abs((hsv.H / 60) % 2 - 1));

        let m = hsv.V - c;

        let r_ = 0;
        let g_ = 0;
        let b_ = 0;

        if (hsv.H >= 0 && hsv.H < 60) {
            r_ = c;
            g_ = x;
            b_ = 0;
        }
        else if (hsv.H >= 60 && hsv.H < 120) {
            r_ = x;
            g_ = c;
            b_ = 0;
        }
        else if (hsv.H >= 120 && hsv.H < 180) {
            r_ = 0;
            g_ = c;
            b_ = x;
        }
        else if (hsv.H >= 180 && hsv.H < 240) {
            r_ = 0;
            g_ = x;
            b_ = c;
        }
        else if (hsv.H >= 240 && hsv.H < 300) {
            r_ = x;
            g_ = 0;
            b_ = c;
        }
        else if (hsv.H >= 300 && hsv.H < 360) {
            r_ = c;
            g_ = 0;
            b_ = x;
        }

        let r = (r_ + m) * 255;
        let g = (g_ + m) * 255;
        let b = (b_ + m) * 255;

        return new RgbColor(r, g, b);
    }

    public CmykToHsv(cmyk: CmykColor) : HsvColor 
    {
        let rgb = this.CmykToRgb(cmyk);
        return this.RgbToHsv(rgb);
    }

    public HsvToCmyk(hsv : HsvColor) : CmykColor
    {
        let rgb = this.HsvToRgb(hsv);
        return this.RgbToCmyk(rgb);
    }

    private Min(a: number, b: number, c: number): number {
        if (a < b) {
            if (a < c)
                return a;
            return c;
        }
        else {
            if (b < c)
                return b;
            return c;
        }
    }

    private Max(a: number, b: number, c: number): number {
        if (a > b) {
            if (a > c)
                return a;
            return c;
        }
        else {
            if (b > c)
                return b;
            return c;
        }
    }
}
