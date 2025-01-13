import React from "react";
import { Link } from "react-router";

export type BreadcrumbProps = {
    name: string;
    path?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ name, path }) => {

    return path ? (
        <Link to={path} className="ms-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white">{name}</Link>
    ): (
        <span className="ms-1 text-sm font-medium text-gray-500 md:ms-2 dark:text-gray-400">{name}</span>
    );
}