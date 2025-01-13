export type StorageItem = {
    name: string;
    type: 'dir' | 'file';
    size: number;
    lastModifiedAt: string;
}