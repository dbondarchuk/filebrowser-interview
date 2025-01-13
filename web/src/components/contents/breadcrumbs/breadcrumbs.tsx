import React from "react";
import { ChevronRight } from "../../icons/chevronRight";
import { HomeIcon } from "../../icons/home";
import { Breadcrumb } from "./breadcrumb";
import { Link } from "react-router";

export type BreadcrumbsProps = {
    breadcrumbs: string[];
    entryPath?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ breadcrumbs, entryPath }) => (
    <nav className="flex px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse flex-wrap">
            <li className="inline-flex items-center">
                <Link to={entryPath || '/'} className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white">
                    <HomeIcon />
                    Home
                </Link>
            </li>
            {breadcrumbs.map((path, index) => (
                <li className="inline-flex items-center" key={index}>
                    <ChevronRight />
                    <Breadcrumb name={path} path={index !== breadcrumbs.length - 1 ? `/contents/${breadcrumbs.slice(0, index+1).join('/')}` : undefined} />
                </li>
            ))}
        </ol>
    </nav>
)