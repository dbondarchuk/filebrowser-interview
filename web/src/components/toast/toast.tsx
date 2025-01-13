import React from "react";

export type ToastProps = {
    type: keyof typeof toastStyles;
    title: string;
    message: string;
}

type ToastFn = ({ title, message, type, closeAfter }: ToastProps & { closeAfter?: number }) => void;
type ToasterContextProps = { 
    toasts: Record<string, ToastProps>;
    addToast: (toast: ToastProps) => string;
    removeToast: (id: string) => void;
}

const ToasterContext = React.createContext<ToasterContextProps>({ toasts: {}, addToast: () => '', removeToast: () => {} });

const ToasterImpl = () => {
    const {toasts, removeToast} = React.useContext(ToasterContext);
    return (
        <div className="fixed bottom-0 right-0 z-[9999]">
            {Object.entries(toasts).map(([id, toast]) => <Toast key={id} {...toast} onClose={() => removeToast(id)}/>)}
        </div>
    );
}

export const Toaster: React.FC<{children: React.ReactNode}> = ({children}) => {
    const [toasts, setToasts] = React.useState<Record<string, ToastProps>>({});
    const addToast = React.useCallback((toast: ToastProps) => {
        const id = Date.now().toString(36); // will suffice for now instead of uuid
        setToasts(prev => ({
            ...prev,
            [id]: toast
        }));

        return id;
    }, [setToasts, toasts]);

    const removeToast = React.useCallback((id: string) => {
        setToasts(prev => {
            const {[id]: _, ...rest} = prev;
            return rest;
        });
    }, [setToasts]);

    return (
    <ToasterContext.Provider value={{ toasts, addToast, removeToast }}>
        <ToasterImpl />
        {children}
    </ToasterContext.Provider>
)};

const toastStyles = {
    info: {
        background: "bg-sky-100",
        icon: (<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd" transform="translate(2 2)">
                <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="8.5" cy="8.5" r="8" />
                    <path d="m8.5 12.5v-4h-1" />
                    <path d="m7.5 12.5h2" />
                </g>
                <circle cx="8.5" cy="5.5" r="1" fill="currentColor" />
            </g>
        </svg>),
    },
    warn: {
        background: "bg-orange-100",
        icon: (<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <circle cx="10.5" cy="10.5" r="8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m10.5 11.5v-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10.5" cy="14.5" r="1" fill="currentColor" />
            </g>
        </svg>),
    },
    error: {
        background: "bg-rose-100",
        icon: (<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd">
                <circle cx="10.5" cy="10.5" r="8" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <path d="m10.5 11.5v-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="10.5" cy="14.5" r="1" fill="currentColor" />
            </g>
        </svg>),
    },
    success: {
        background: "bg-emerald-100",
        icon: (<svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
            <g fill="none" fillRule="evenodd" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" transform="translate(2 2)">
                <circle cx="8.5" cy="8.5" r="8" />
                <path d="m5.5 9.5 2 2 5-5" />
            </g>
        </svg>),
    },
};

const Toast: React.FC<ToastProps & {onClose: () => void}> = ({ title, message, type, onClose }) => {
    const style = toastStyles[type];
    return (
        <div className={`flex duration-200 justify-between m-8 me-4 p-4 rounded-lg transition sm:w-96 w-auto ${style.background}`}>
            <div className="flex items-center justify-center">{style.icon}</div>
            <div className="ml-4 mr-2 w-full">
                <div className="font-semibold text-xl">{title}</div>
                <p>{message}</p>
            </div>
            <div className="flex items-center justify-center cursor-pointer" onClick={onClose}>
                <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
                    <g fill="none" fillRule="evenodd" transform="translate(5 5)" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                        <path d="m10.5 10.5-10-10z" />
                        <path d="m10.5.5-10 10" />
                    </g>
                </svg>
            </div>
        </div>
    )
}

export const useToast = () => {
    const toaster = React.useContext(ToasterContext);

    return {
        toast: ({ closeAfter = 5, ...toast }) => {
            const id = toaster.addToast(toast);

            setTimeout(() => {
                toaster.removeToast(id);
            }, closeAfter * 1000);
        }
    } satisfies {
        toast:ToastFn
    }
}