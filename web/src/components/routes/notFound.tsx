import { Link } from "react-router";
import { Logo } from "../logo/logo";

export const NotFoundRoute = () => (
    <div className="relative flex min-h-screen flex-col gap-4 justify-center overflow-hidden bg-gray-50 py-6 sm:py-12">
            <div className="container mx-auto flex flex-col gap-5 items-center">
               <Logo/>

                <div className="text-4xl text-black">
                    404
                </div>
                <div className="text-gray-700">
                    Nothing to see here
                </div>
                <div>
                    <Link to="/" className=" text-blue-700 hover:text-blue-800">Go home</Link>
                </div>
            </div>
        </div>
)