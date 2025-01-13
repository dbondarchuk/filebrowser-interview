import React from "react";
import { Link } from "react-router";
import { StorageItem } from "../../../types/storageItem"
import { SortOrder } from "../../../types/sort";
import { compareDates, compareNumbers, compareStrings } from "../../../utils/sort";
import { StorageItemRow } from "./row/storageItemRow";
import { HeaderCell } from "./header/headerCell";

export type StorageItemsTableProps = {
    items: StorageItem[];
    currentPath: string;
    filter: string | null;
}

const SORT_LOCAL_STORAGE_KEY = 'sort';

type SortField = Exclude<keyof StorageItem, 'type'>;
type SortState = {field: SortField, order: SortOrder};
type SortFn = (a: StorageItem, b: StorageItem) => number;

const sortFn: (sortState: SortState) => SortFn = (sortState) => {
    return (a, b) => {
        // Do regular compare for lastModifiedAt
        if (sortState.field === 'lastModifiedAt') {
            return compareDates(new Date(a.lastModifiedAt), new Date(b.lastModifiedAt), sortState.order);
        }

        // Otherwise make folders appear first
        if (a.type === 'dir' && b.type === 'file') {
            return -1;
        }

        if (a.type === 'file' && b.type === 'dir') {
            return 1;
        }

        // If both are folders, don't sort when sorted by size
        if (a.type === 'dir' && b.type === 'dir') {
            return compareStrings(a.name, b.name, sortState.field === 'name' ? sortState.order : 'asc');
        }

        // Sort normally
        return sortState.field === 'name' 
            ? compareStrings(a.name, b.name, sortState.order) 
            : compareNumbers(a.size, b.size, sortState.order);
    }
}

export const StorageItemsTable: React.FC<StorageItemsTableProps> = ({ items, currentPath, filter }) => {
    const [sort, setSort] = React.useState<SortState>({field: 'name', order: 'asc'})
    React.useEffect(() => {
        try {
            const storedSort = JSON.parse(localStorage.getItem(SORT_LOCAL_STORAGE_KEY) || '') as SortState;
            if (storedSort?.field && storedSort?.order) {
                setSort(storedSort)
            }
        } catch {
            console.error('Failed to parse sort state from local storage');
        }
    }, [setSort])
    
    const storageItems = React.useMemo(() => {
        const filtered = !filter 
            ? items
            : items.filter(item => item.name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) >= 0);
            
            return filtered.sort(sortFn(sort));
    }, [items, filter, sort]);

    const parentPath = currentPath.length 
        ? `/contents${currentPath.split('/').slice(0, -1).join('/')}` : undefined;

    const onSort = (field: SortField) => {
        return (order: SortOrder) => {
            setSort({field, order});
            try {
                localStorage.setItem(SORT_LOCAL_STORAGE_KEY, JSON.stringify({
                    field, 
                    order
                } satisfies SortState))
            } catch {
                console.error('Failed to save sort to local storage');
            }
        }
    };

    return (
        <div className="relative overflow-x-auto flex flex-col gap-2">
            <table className="w-full text-base text-left rtl:text-right text-gray-500 dark:text-gray-400 table-auto">
                <thead className="text-sm text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <HeaderCell name="Type"/>
                        <HeaderCell name="Name" onSort={onSort('name')} sorted={sort.field === 'name' ? sort.order : undefined} />
                        <HeaderCell name="Last modified" onSort={onSort('lastModifiedAt')} sorted={sort.field === 'lastModifiedAt' ? sort.order : undefined} />
                        <HeaderCell name="Size" onSort={onSort('size')} sorted={sort.field === 'size' ? sort.order : undefined} />
                    </tr>
                </thead>
                <tbody>
                    {parentPath && (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4" colSpan={4}><Link title="Go to parent folder" className="block w-full" to={parentPath}>..</Link></td>
                        </tr>
                    )}
                    {storageItems.map((item) => (
                        <StorageItemRow item={item} currentPath={currentPath} key={item.name} />
                    ))}
                    {storageItems.length === 0 && (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                            <td className="px-6 py-4 text-center" colSpan={4}><span className="block w-full">Nothing to see here</span></td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}