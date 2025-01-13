import React from "react";
import { FileIcon } from "../icons/file";

export const Logo: React.FC<{className?: string}> = ({className}) => (
    <div className={`flex flex-row gap-2 w-full items-center justify-center uppercase text-2xl ${className}`}>
        <FileIcon /> FileBrowser
    </div>
);