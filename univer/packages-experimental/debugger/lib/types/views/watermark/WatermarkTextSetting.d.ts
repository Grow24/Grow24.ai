import { ITextWatermarkConfig } from '@univerjs/engine-render';
interface IWatermarkTextSettingProps {
    config?: ITextWatermarkConfig;
    onChange: (config: ITextWatermarkConfig) => void;
}
export declare function WatermarkTextSetting(props: IWatermarkTextSettingProps): import("react/jsx-runtime").JSX.Element | null;
export {};
