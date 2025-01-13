import React from "react";
import { Link } from "react-router";
import { FileIcon } from "../../../icons/file";
import { FolderIcon } from "../../../icons/folder";
import { StorageItem } from "../../../../types/storageItem";
import { formatBytes } from "../../../../utils/filesize";

export type StorageItemRowProps = {
    item: StorageItem;
    currentPath: string;
}

export const StorageItemRow: React.FC<StorageItemRowProps> = ({item, currentPath}) => (
    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
        <td className={`px-6 py-4 ${item.type === 'dir' ? "text-black dark:text-white" : ""}`}>{item.type === 'file' ? <FileIcon /> : <FolderIcon/> }</td>
        <td className={`px-6 py-4 ${item.type === 'dir' ? "text-black dark:text-white" : ""}`}>
            {item.type === 'dir' ? <Link className="block w-full" to={`/contents${currentPath}/${encodeURIComponent(item.name)}`}>{item.name}</Link> : item.name}
        </td>
        <td className="px-6 py-4">{new Date(item.lastModifiedAt).toLocaleString()}</td>
        <td className="px-6 py-4">{item.type !== 'dir' && formatBytes(item.size)}</td>
    </tr>
)