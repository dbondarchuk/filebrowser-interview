import React from "react";
import Cookies from 'js-cookie';
import { Link, useLocation, useSearchParams } from "react-router";

import { FolderContent } from "../contents/folderContent";
import { Spinner } from "../icons/spinner";
import { Logo } from "../logo/logo";

export const ContentsRoute = () => {
    const location = useLocation();
    const path = location.pathname.substring("/contents".length);
    const [searchParams, setSearchParams] = useSearchParams();

    const [username, setUsername] = React.useState<string | undefined>();
    React.useEffect(() => {
        const storedName = Cookies.get('authUsername');
        if (storedName) {
            setUsername(storedName);
        }
    }, []);


    const filter = searchParams.get('filter');
    const updateFilter = React.useCallback((filter: string | null) => {
        setSearchParams(prev => {
            if (filter && filter.length) {
                prev.set('filter', filter);
            } else {
                prev.delete('filter');
            }

            return prev;
        });
    }, [setSearchParams]);

    return (
        <div className="relative min-h-screen overflow-hidden bg-gray-50 py-2 md:py-4">
            <div className="mx-auto w-full px-2 md:py-4 lg:px-6">
                <div className="flex flex-col gap-2 md:gap-6">
                    <div className="flex flex-col gap-2 sm:flex-row px-5 py-3 text-gray-700 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700 justify-between">
                        <Logo className="basis-0" />
                        <div className="flex flex-row gap-4 items-center justify-center">
                            {username ? (
                                <>
                                    <span>Welcome, {username}</span> | 
                                    <Link to="/signout" className="text-blue-700">Sign out</Link>
                                </>
                            ) : (<><Spinner /> Loading...</>)}
                        </div>
                    </div>
                    <FolderContent path={path} filter={filter} onFilterChange={updateFilter} />
                </div>
            </div>
        </div>
    );
}