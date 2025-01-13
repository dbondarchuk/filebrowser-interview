import React from "react";
import { SortOrder } from "../../../../types/sort";
import { ArrowUpIcon } from "../../../icons/arrowUp";
import { ArrowDownIcon } from "../../../icons/arrowDown";
import { ArrowDownUpIcon } from "../../../icons/arrowDownUp";

export type HeaderCellProps = {
    name: string;
    sorted?: SortOrder;
    onSort?: (order: SortOrder) => void;
}

const SortIcon: React.FC<{order?: SortOrder}> = ({order}) => {
    switch (order) {
        case 'asc':
            return <ArrowUpIcon />;
        case 'desc':
            return <ArrowDownIcon />;
        
        default:
            return <ArrowDownUpIcon />;
    }
}

export const HeaderCell: React.FC<HeaderCellProps> = ({ name, sorted, onSort }) => {
    const onClick = () => {
        if (!onSort) return;

        const newSort: SortOrder = sorted === 'asc' ? 'desc' : 'asc';
        onSort(newSort);
    }
    return (
        <th className="px-6 py-3 w-16">
            <span className={`inline-flex items-center gap-1 w-full ${onSort ? "cursor-pointer" : ""}`} onClick={onClick}>
                <span>{name}</span> {onSort && <SortIcon order={sorted}/>}
            </span>
        </th>
    )
}