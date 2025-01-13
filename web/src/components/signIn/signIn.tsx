import React from "react";
import { useNavigate } from "react-router";
import { Spinner } from "../icons/spinner";
import { Logo } from "../logo/logo";
import { useToast } from "../toast/toast";

export type SignInFormProps = {
    redirectTo?: string | null;
}

export const SignInForm: React.FC<SignInFormProps> = ({redirectTo}) => {
    const [error, setError] = React.useState<string>();
    const [isLoading, setIsLoading] = React.useState(false);

    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');

    const navigate = useNavigate();
    const {toast} = useToast();

    const onSubmit = async () => {
        if (!username || !password) {
            return;
        }

        setIsLoading(true);
        setError(undefined);

        try {
            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                body: JSON.stringify({
                    username, password
                }),
            });

            if (res.status >= 400) {
                throw new Error(res.status.toString());
            }

            toast({
                title: 'Success',
                message: `You have successfully signed in`,
                type: 'success'
            });

            navigate(redirectTo || '/');
        } catch(e) {
            setError('Login failed; Invalid user ID or password.');
        } finally {
            setIsLoading(false);
        }
    };

    const onUpdate = React.useCallback((field: 'username'  | 'password') => {
        return (e: React.ChangeEvent<HTMLInputElement>) => {
            setError(undefined);

            if (field === 'username') setUsername(e.target.value);
            else setPassword(e.target.value);
        }
    }, [setError, setPassword, setUsername]);

    return (
        <div className="relative flex min-h-screen flex-col gap-4 justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
            <form className="container mx-auto flex flex-col gap-5 px-2" onSubmit={(e) => { onSubmit(); e.preventDefault();} }>
                <Logo />
                <div>
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your username</label>
                    <input 
                        type="text" 
                        placeholder="demo" 
                        value={username}
                        onChange={onUpdate('username')}
                        id="username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required />
                </div>
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                    <input 
                        type="password"
                        id="password" 
                        value={password}
                        onChange={onUpdate('password')}
                        placeholder="*******" 
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                        required />
                </div>
                {error && <div className="text-red-600">
                    {error}
                </div>}
                <button 
                    disabled={!username || !password}
                    type="submit" 
                    className="text-white bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 disabled:cursor-not-allowed focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Sign in</button>
            </form>
            {isLoading && (
                <div className="absolute top-0 left-0 right-0 bottom-0 flex justify-center items-center bg-white opacity-50">
                    <div role="status">
                        <Spinner />
                        <span className="sr-only">Please wait...</span>
                    </div>
                </div>
            )}
        </div>
    );
}