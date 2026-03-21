import { LocaleType } from '@univerjs/core';
export declare function useLocale(): {
    type: "subItem";
    children: string;
    options: {
        type: "radio";
        value: LocaleType;
        options: {
            label: string;
            value: string;
        }[];
        onSelect: (value: string) => Promise<void>;
    }[];
};
