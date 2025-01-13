import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import { ContentsRoute } from "./components/routes/contents";
import { SignInRoute } from "./components/routes/signIn";
import { SignOutRoute } from "./components/routes/signOut";
import { NotFoundRoute } from "./components/routes/notFound";
import { Toaster } from "./components/toast/toast";

import './index.css';

export function App() {
  return (
    <Toaster>
      <BrowserRouter basename="/">
        <Routes>
          <Route path="contents/*" element={<ContentsRoute />}/>
          <Route path="signin" element={<SignInRoute />}/>
          <Route path="signout" element={<SignOutRoute />}/>
          <Route path="/" element={<Navigate to="/contents"/>} />
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </BrowserRouter>
    </Toaster>
  );
}
