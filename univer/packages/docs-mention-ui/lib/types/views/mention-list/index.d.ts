import { IMention, ITypeMentionList } from '@univerjs/core';
export interface IMentionListProps {
    mentions: ITypeMentionList[];
    active?: string;
    onSelect?: (item: IMention) => void;
    onClick?: () => void;
    editorId: string;
}
export declare const MentionList: (props: IMentionListProps) => import("react/jsx-runtime").JSX.Element;
