import { useSearchParams } from "react-router";
import { SignInForm } from "../signIn/signIn";

export const SignInRoute = () => {
    const [searchParams] = useSearchParams();

    return <SignInForm redirectTo={searchParams.get('to')} />
}