export interface ImageAsset {
    id: string;
    date : string;
    src: string;
    file: File;
    name: string;
    description?: string;
    isHidden?: boolean;
}