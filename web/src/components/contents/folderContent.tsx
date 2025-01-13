import React from "react";
import { useLocation, useNavigate } from "react-router";

import { StorageItem } from "../../types/storageItem";
import { StorageItemsTable } from "./table/storageItemsTable";
import { useCleanedPath } from "../../utils/useCleanedPath";
import { useDebounce } from "../../utils/useDebounce";
import { Breadcrumbs } from "./breadcrumbs/breadcrumbs";
import { SearchIcon } from "../icons/search";
import { useToast } from "../toast/toast";

export type FolderContentProps = {
    path: string;
    filter: string | null;

    onFilterChange: (filter: string | null) => void;
}

export const FolderContent: React.FC<FolderContentProps> = ({ path, filter, onFilterChange }) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [items, setItems] = React.useState<StorageItem[]>([]);

    const [stateFilter, setStateFilter] = React.useState(filter || '');
    const {toast} = useToast();
    
    // Clean up state filter on prop change (i.e. navigation with filter on)
    React.useEffect(() => {
        setStateFilter(filter || '');
    }, [filter]);

    const debouncedFilter = useDebounce(stateFilter);

    const navigate = useNavigate();
    const location = useLocation();

    const { breadcrumbs, cleanedPath } = useCleanedPath(path);

    React.useEffect(() => {
        onFilterChange(debouncedFilter);
    }, [debouncedFilter]);

    const getItems = async () => {
        setIsLoading(true);

        try {
            const response = await fetch(`/api/contents${cleanedPath}`);
            if (response.status === 401) {
                console.error('Unauthorized');
                toast({
                    title: 'Unauthorized',
                    message: 'Please sign in to use Filebrowser',
                    type: 'error'
                });

                navigate(`/signin?to=${encodeURIComponent(`${location.pathname}${location.search}${location.hash}`)}`);
                return;
            } else if (response.status === 404) {
                console.error('Unknow path');
                toast({
                    title: 'Unknow path',
                    message: `Path ${cleanedPath} was not found`,
                    type: 'error'
                });

                navigate('/404');
                return;
            }

            const body = await response.text();
            if (response.status === 400 && body === 'OUT_OF_BOUNDS') {
                console.error('Unauthorized access!');
                toast({
                    title: 'Unauthorized access',
                    message: `You don't have permissions to browse this path`,
                    type: 'error'
                });

                navigate('/signout');
                return;
            } else if (response.status >= 400) {
                throw new Error(`Request has failed: ${response.status}`);
            }

            const json = JSON.parse(body) as StorageItem[];

            setItems(json as StorageItem[]);
        } catch (e) {
            console.error(e);
            toast({
                title: 'Oh no!',
                message: `Something went wrong: ${e}`,
                type: 'error'
            });

        } finally {
            setIsLoading(false);
        }
    }

    React.useEffect(() => {
        getItems();
    }, [cleanedPath]);

    return (
        <div className="flex flex-col gap-4">
            <Breadcrumbs breadcrumbs={breadcrumbs} entryPath="/contents" />
            <div className="grid grid-cols-1 md:grid-cols-2 w-full items-center">
                    <div className="w-full flex items-center md:justify-end md:order-last">
                        <span className="text-blue-700 cursor-pointer" onClick={getItems}>Refresh</span>
                    </div>
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative mt-1">
                        <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input 
                            type="text" 
                            value={stateFilter}
                            onChange={(e) => setStateFilter(e.target.value)}
                            id="table-search" 
                            className="w-full block py-2 ps-10 text-base text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search for items" />
                    </div>
            </div>

            {isLoading && "Loading..."}
            {!isLoading && <StorageItemsTable items={items} currentPath={cleanedPath} filter={stateFilter} />}
        </div>
    );
}