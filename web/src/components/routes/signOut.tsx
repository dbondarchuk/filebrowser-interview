import { useEffect, useState } from "react"
import { useNavigate } from "react-router"
import { Spinner } from "../icons/spinner"
import { useToast } from "../toast/toast";

export const SignOutRoute = () => {
    const navigate = useNavigate();
    const [error, setError] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const { toast } = useToast();

    const signOut = async () => {
        try {
            setError(undefined);
            setIsLoading(true);

            const response = await fetch('/api/auth/signout', {
                method: 'POST'
            });

            if (response.status < 400 || response.status === 401) {
                toast({
                    title: 'Success',
                    message: `You've been successfully signed out`,
                    type: 'success'
                });

                navigate('/signin');
                return;
            }

            throw new Error(`Sign out failed: ${response.status}`);
        } catch (e: any) {
            if ('message' in e) setError(e.message);
            else setError(e.toString())

            toast({
                title: 'Oh no!',
                message: `Something went wrong: ${e}`,
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        signOut();
    }, []);

    if (isLoading) return <Spinner />;
    if (error) return (
        <div>
            Something went wrong: <span className="text-red-700">{error}</span>. <span className="text-blue-700 cursor-pointer" onClick={signOut}>Try again</span>
        </div>
    );

    return null;
}