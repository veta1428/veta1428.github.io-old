import { ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Color, ColorPickerControl } from '@iplab/ngx-color-picker';
import { ColorService } from '../color.service';
import { CmykColor, ColorModel, HsvColor, RgbColor } from '../models/color-models';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent {
    public compactControl = new ColorPickerControl();
    public colorModels = [ColorModel.RGB, ColorModel.HSV, ColorModel.CMYK];
    public selectedItem = ColorModel.RGB;
    public form: FormGroup;
    public currentModel: ColorModel = ColorModel.RGB;
    public rgbColor: RgbColor = new RgbColor(65, 19, 125);
    public shouldRegisterCPEvents: boolean = true;
    public shouldRegisterInp1Events: boolean = false;
    /**
     *
     */
    constructor(
        private _cdr: ChangeDetectorRef,
        private _cs: ColorService
    ) {
        this.form = new FormGroup({
            first: new FormControl('', [this.firstControlValidator()]),
            second: new FormControl('', [this.secondControlValidator()]),
            third: new FormControl('', [this.thirdControlValidator()]),
            fourth: new FormControl('', [this.fourthControlValidator()]),
            modelSelect: new FormControl(''),
            firstReadonly: new FormControl(''),
            secondReadonly: new FormControl('')
        });
        this.form?.controls?.modelSelect.setValue(ColorModel.RGB);
        this.setColorPickerValue(this.rgbColor);
    }
    ngOnInit() {

        this.form?.controls.modelSelect.valueChanges.subscribe((e: number) => {
            let prev = this.currentModel;
            this.currentModel = Number(e);
            this.onModelChanged(prev, Number(e));
            this._cdr.detectChanges();
        });
        this.compactControl.valueChanges.subscribe((_) => {
            this.onColorPickerValueChanged(this.compactControl.value);
        });

        this.first.valueChanges.subscribe((_) => {
            this.form.markAllAsTouched();
            this.form.updateValueAndValidity();
            if (!this.form.valid) {
                return;
            }

            this.updateReadonlyControlsFromInput();
        });

        this.second.valueChanges.subscribe((_)=>{
            this.form.markAllAsTouched();
            this.form.updateValueAndValidity();
            if (!this.form.valid) {
                return;
            }

            this.updateReadonlyControlsFromInput();
        })

        this.third.valueChanges.subscribe((_)=>{
            this.form.markAllAsTouched();
            this.form.updateValueAndValidity();
            if (!this.form.valid) {
                return;
            }

            this.updateReadonlyControlsFromInput();
        })

        this.fourth.valueChanges.subscribe((_)=>{
            this.form.markAllAsTouched();
            this.form.updateValueAndValidity();
            if (!this.form.valid) {
                return;
            }

            this.updateReadonlyControlsFromInput();
        })

        this.updateColorInputControls();
        this.updateReadonlyControls();
    }

    protected getFirstControl() {
        return this.form.controls.first;
    }

    protected getSecondControl() {
        return this.form.controls.second;
    }

    protected getThirdControl() {
        return this.form.controls.third;
    }

    protected getFourthControl() {
        return this.form.controls.fourth;
    }

    protected getFirstReadonlyControl() {
        return this.form.controls.firstReadonly;
    }

    protected getSecondReadonlyControl() {
        return this.form.controls.secondReadonly;
    }

    public get first() {
        return this.form.controls.first;
    }

    public get second() {
        return this.form.controls.second;
    }

    public get third() {
        return this.form.controls.third;
    }

    public get fourth() {
        return this.form.controls.fourth;
    }

    public getUIModel(model: ColorModel) {
        return ColorModel[model];
    }

    public onColorPickerValueChanged(color: Color) {
        let rgb = color.getRgba();
        this.rgbColor = new RgbColor(rgb.red ?? 0, rgb.green ?? 0, rgb.blue ?? 0);


        this.updateColorInputControls();
        this.updateReadonlyControls();
    }

    public updateColorInputControls() {
        switch (this.currentModel) {
            case ColorModel.RGB:
                {
                    this.getFirstControl().setValue(Math.round(this.rgbColor.R));
                    this.getSecondControl().setValue(Math.round(this.rgbColor.G));
                    this.getThirdControl().setValue(Math.round(this.rgbColor.B));
                    break;
                }
            case ColorModel.CMYK:
                {
                    let cmyk = this._cs.RgbToCmyk(this.rgbColor);
                    this.getFirstControl().setValue(Math.round(cmyk.C * 100));
                    this.getSecondControl().setValue(Math.round(cmyk.M * 100));
                    this.getThirdControl().setValue(Math.round(cmyk.Y * 100));
                    this.getFourthControl().setValue(Math.round(cmyk.K * 100));
                    break;
                }
            case ColorModel.HSV:
                {
                    let hsv = this._cs.RgbToHsv(this.rgbColor);
                    this.getFirstControl().setValue(Math.round(hsv.H));
                    this.getSecondControl().setValue(Math.round(hsv.S * 100));
                    this.getThirdControl().setValue(Math.round(hsv.V * 100));
                    break;
                }

        }

        this._cdr.detectChanges();
    }

    public updateReadonlyControls() {
        switch (this.currentModel) {
            case ColorModel.RGB:
                {
                    let cmyk = this._cs.RgbToCmyk(new RgbColor(this.rgbColor.R, this.rgbColor.G, this.rgbColor.B));
                    this.getSecondReadonlyControl().setValue((cmyk.C * 100).toFixed(0) + '%  ' + (cmyk.M * 100).toFixed(0) + '%  ' + (cmyk.Y * 100).toFixed(0) + '%  ' + (cmyk.K * 100).toFixed(0) + '%');

                    let hsv = this._cs.RgbToHsv(new RgbColor(this.rgbColor.R, this.rgbColor.G, this.rgbColor.B));
                    this.getFirstReadonlyControl().setValue(hsv.H.toFixed(0) + '°  ' + (hsv.S * 100).toFixed(0) + '%  ' + (hsv.V * 100).toFixed(0) + '%');
                    break;
                }
            case ColorModel.CMYK:
                {
                    this.getFirstReadonlyControl().setValue(this.rgbColor.R.toFixed(0) + '  ' + this.rgbColor.G.toFixed(0) + '  ' + this.rgbColor.B.toFixed(0));

                    // to hsv
                    let hsv = this._cs.RgbToHsv(new RgbColor(this.rgbColor.R, this.rgbColor.G, this.rgbColor.B));
                    this.getSecondReadonlyControl().setValue(hsv.H.toFixed(0) + '°  ' + (hsv.S * 100).toFixed(0) + '%  ' + (hsv.V * 100).toFixed(0) + '%');
                    break;
                }
            case ColorModel.HSV:
                {
                    this.getFirstReadonlyControl().setValue(this.rgbColor.R.toFixed(0) + '  ' + this.rgbColor.G.toFixed(0) + '  ' + this.rgbColor.B.toFixed(0));

                    // cmyk

                    let cmyk = this._cs.RgbToCmyk(new RgbColor(this.rgbColor.R, this.rgbColor.G, this.rgbColor.B));
                    this.getSecondReadonlyControl().setValue((cmyk.C * 100).toFixed(0) + '%  ' + (cmyk.M * 100).toFixed(0) + '%  ' + (cmyk.Y * 100).toFixed(0) + '%  ' + (cmyk.K * 100).toFixed(0) + '%');
                    break;
                }

        }
        this._cdr.detectChanges();
    }

    public updateReadonlyControlsFromInput() {

        let rgb: RgbColor;

        switch (this.currentModel) {
            case ColorModel.RGB:
                {
                    rgb = new RgbColor(this.getFirstControl().value, this.getSecondControl().value, this.getThirdControl().value);
                    //this.setColorPickerValue(rgb);
                    break;
                }
            case ColorModel.HSV:
                {
                    let h = this.getFirstControl().value;
                    let s = this.getSecondControl().value / 100;
                    let v = this.getThirdControl().value / 100;
                    rgb = this._cs.HsvToRgb(new HsvColor(h, s, v));
                    break;
                }
            case ColorModel.CMYK:
                {
                    let c = this.getFirstControl().value / 100;
                    let m = this.getSecondControl().value / 100;
                    let y = this.getThirdControl().value / 100;
                    let k = this.getFourthControl().value / 100;
                    rgb = this._cs.CmykToRgb(new CmykColor(c, m, y, k));
                    break;
                }
        }


        switch (this.currentModel) {
            case ColorModel.RGB:
                {
                    let cmyk = this._cs.RgbToCmyk(new RgbColor(rgb.R, rgb.G, rgb.B));
                    this.getSecondReadonlyControl().setValue((cmyk.C * 100).toFixed(0) + '%  ' + (cmyk.M * 100).toFixed(0) + '%  ' + (cmyk.Y * 100).toFixed(0) + '%  ' + (cmyk.K * 100).toFixed(0) + '%');

                    let hsv = this._cs.RgbToHsv(new RgbColor(rgb.R, rgb.G, rgb.B));
                    this.getFirstReadonlyControl().setValue(hsv.H.toFixed(0) + '°  ' + (hsv.S * 100).toFixed(0) + '%  ' + (hsv.V * 100).toFixed(0) + '%');
                    break;
                }
            case ColorModel.CMYK:
                {
                    this.getFirstReadonlyControl().setValue(rgb.R.toFixed(0) + '  ' + rgb.G.toFixed(0) + '  ' + rgb.B.toFixed(0));

                    // to hsv
                    let hsv = this._cs.RgbToHsv(new RgbColor(rgb.R, rgb.G, rgb.B));
                    this.getSecondReadonlyControl().setValue(hsv.H.toFixed(0) + '°  ' + (hsv.S * 100).toFixed(0) + '%  ' + (hsv.V * 100).toFixed(0) + '%');
                    break;
                }
            case ColorModel.HSV:
                {
                    this.getFirstReadonlyControl().setValue(rgb.R.toFixed(0) + '  ' + rgb.G.toFixed(0) + '  ' + rgb.B.toFixed(0));

                    // cmyk

                    let cmyk = this._cs.RgbToCmyk(new RgbColor(rgb.R, rgb.G, rgb.B));
                    this.getSecondReadonlyControl().setValue((cmyk.C * 100).toFixed(0) + '%  ' + (cmyk.M * 100).toFixed(0) + '%  ' + (cmyk.Y * 100).toFixed(0) + '%  ' + (cmyk.K * 100).toFixed(0) + '%');
                    break;
                }

        }
        this._cdr.detectChanges();
    }

    public setColorPickerValue(color: RgbColor) {
        let rgba = this.compactControl.value.getRgba();
        rgba.red = color.R;
        rgba.green = color.G;
        rgba.blue = color.B;
        this.compactControl.setValueFrom(rgba);
    }

    public updateColorPickerControls() {
        switch (this.currentModel) {
            case ColorModel.RGB:
                {
                    let rgb = new RgbColor(this.getFirstControl().value, this.getSecondControl().value, this.getThirdControl().value);
                    this.setColorPickerValue(rgb);
                    break;
                }
            case ColorModel.HSV:
                {
                    let h = this.getFirstControl().value;
                    let s = this.getSecondControl().value / 100;
                    let v = this.getThirdControl().value / 100;
                    this.setColorPickerValue(this._cs.HsvToRgb(new HsvColor(h, s, v)));
                    break;
                }
            case ColorModel.CMYK:
                {
                    let c = this.getFirstControl().value / 100;
                    let m = this.getSecondControl().value / 100;
                    let y = this.getThirdControl().value / 100;
                    let k = this.getFourthControl().value / 100;
                    this.setColorPickerValue(this._cs.CmykToRgb(new CmykColor(c, m, y, k)));
                    break;
                }
        }
        this._cdr.detectChanges();
    }

    public onCalculateClicked() {
        this.form.markAllAsTouched();
        this.form.updateValueAndValidity();
        if (!this.form.valid) {
            return;
        }

        this.updateColorPickerControls();
    }

    public onModelChanged(prev: ColorModel, next: ColorModel) {
        this.form.controls.first.setErrors(null);
        if (prev == ColorModel.RGB) {
            if (next == ColorModel.CMYK) {
                let cmyk = this._cs.RgbToCmyk(this.rgbColor);
                this.getFirstControl().setValue(Math.round(cmyk.C * 100));
                this.getSecondControl().setValue(Math.round(cmyk.M * 100));
                this.getThirdControl().setValue(Math.round(cmyk.Y * 100));
                this.getFourthControl().setValue(Math.round(cmyk.K * 100));
            }
            else // HSV
            {
                let hsv = this._cs.RgbToHsv(this.rgbColor);
                this.getFirstControl().setValue(Math.round(hsv.H));
                this.getSecondControl().setValue(Math.round(hsv.S * 100));
                this.getThirdControl().setValue(Math.round(hsv.V * 100));
            }

        }
        else if (prev == ColorModel.HSV) {
            if (next == ColorModel.RGB) {
                this.getFirstControl().setValue(Math.round(this.rgbColor.R));
                this.getSecondControl().setValue(Math.round(this.rgbColor.G));
                this.getThirdControl().setValue(Math.round(this.rgbColor.B));
            }
            else // CMYK
            {
                let cmyk = this._cs.RgbToCmyk(this.rgbColor);
                this.getFirstControl().setValue(Math.round(cmyk.C * 100));
                this.getSecondControl().setValue(Math.round(cmyk.M * 100));
                this.getThirdControl().setValue(Math.round(cmyk.Y * 100));
                this.getFourthControl().setValue(Math.round(cmyk.K * 100));
            }
        }
        else if (prev == ColorModel.CMYK) {
            if (next == ColorModel.HSV) {
                let hsv = this._cs.RgbToHsv(this.rgbColor);
                this.getFirstControl().setValue(Math.round(hsv.H));
                this.getSecondControl().setValue(Math.round(hsv.S * 100));
                this.getThirdControl().setValue(Math.round(hsv.V * 100));
            }
            else // RGB
            {
                this.getFirstControl().setValue(Math.round(this.rgbColor.R));
                this.getSecondControl().setValue(Math.round(this.rgbColor.G));
                this.getThirdControl().setValue(Math.round(this.rgbColor.B));
            }
        }

        this.updateReadonlyControls();
        this._cdr.detectChanges();
    }

    public showLastField(): boolean {
        if (this.currentModel != ColorModel.CMYK) {
            return true;
        }
        return false;
    }

    public getPlaceholder(position: number) {
        switch (position) {
            case 1: {
                switch (this.currentModel) {
                    case ColorModel.RGB: return 'R';
                    case ColorModel.HSV: return 'H';
                    case ColorModel.CMYK: return 'C';
                    default: return '';
                }
            }
            case 2: {
                switch (this.currentModel) {
                    case ColorModel.RGB: return 'G';
                    case ColorModel.HSV: return 'S';
                    case ColorModel.CMYK: return 'M';
                    default: return '';
                }
            }
            case 3: {
                switch (this.currentModel) {
                    case ColorModel.RGB: return 'B';
                    case ColorModel.HSV: return 'V';
                    case ColorModel.CMYK: return 'Y';
                    default: return '';
                }
            }
            case 4: {
                switch (this.currentModel) {
                    case ColorModel.CMYK: return 'K';
                    default: return '';
                }
            }
        }

        return '';
    }

    // get labels

    // RGB hsv cmyk
    // HSV rgb cmyk
    // CMYK rgb hsv

    public getReadonlyLabel(position: number) {
        switch (position) {
            case 1:
                {
                    if (this.currentModel == ColorModel.RGB) {
                        return 'HSV';
                    }
                    return 'RGB';
                }
            case 2:
                {
                    if (this.currentModel == ColorModel.CMYK) {
                        return 'HSV';
                    }
                    return 'CMYK';
                }
        }

        return '';
    }

    // validators

    private firstControlValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            switch (this.currentModel) {
                case ColorModel.RGB:
                    {
                        let val = control.value;
                        if (val < 0 || val > 255) {
                            return { value: 'Value must be from 0 to 255' };
                        }
                        return null;
                    }
                case ColorModel.HSV:
                    {
                        let val = control.value;
                        if (val < 0 || val > 360) {
                            return { value: 'Value must be from 0 to 360' };
                        }
                        return null;
                    }
                case ColorModel.CMYK:
                    {
                        let val = control.value;
                        if (val < 0 || val > 100) {
                            return { value: 'Value must be from 0 to 100' };
                        }
                        return null;
                    }
            }
        };
    }

    private secondControlValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            switch (this.currentModel) {
                case ColorModel.RGB:
                    {
                        let val = control.value;
                        if (val < 0 || val > 255) {
                            return { value: 'Value must be from 0 to 255' };
                        }
                        return null;
                    }
                case ColorModel.HSV:
                    {
                        let val = control.value;
                        if (val < 0 || val > 100) {
                            return { value: 'Value must be from 0 to 100' };
                        }
                        return null;
                    }
                case ColorModel.CMYK:
                    {
                        let val = control.value;
                        if (val < 0 || val > 100) {
                            return { value: 'Value must be from 0 to 100' };
                        }
                        return null;
                    }
            }
        };
    }

    private thirdControlValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            switch (this.currentModel) {
                case ColorModel.RGB:
                    {
                        let val = control.value;
                        if (val < 0 || val > 255) {
                            return { value: 'Value must be from 0 to 255' };
                        }
                        return null;
                    }
                case ColorModel.HSV:
                    {
                        let val = control.value;
                        if (val < 0 || val > 100) {
                            return { value: 'Value must be from 0 to 100' };
                        }
                        return null;
                    }
                case ColorModel.CMYK:
                    {
                        let val = control.value;
                        if (val < 0 || val > 100) {
                            return { value: 'Value must be from 0 to 100' };
                        }
                        return null;
                    }
            }
        };
    }

    private fourthControlValidator(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            switch (this.currentModel) {
                case ColorModel.CMYK:
                    {
                        let val = control.value;
                        if (val < 0 || val > 100) {
                            return { value: 'Value must be from 0 to 100' };
                        }
                        return null;
                    }
            }
            return null;
        };
    }
}
