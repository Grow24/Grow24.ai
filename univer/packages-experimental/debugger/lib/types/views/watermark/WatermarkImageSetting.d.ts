import { IImageWatermarkConfig } from '@univerjs/engine-render';
interface IWatermarkImageSettingProps {
    config?: IImageWatermarkConfig;
    onChange: (config: IImageWatermarkConfig) => void;
}
export declare function WatermarkImageSetting({ config, onChange }: IWatermarkImageSettingProps): import("react/jsx-runtime").JSX.Element | null;
export {};
