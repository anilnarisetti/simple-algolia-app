import "@/styles/globals.css";
import type {AppProps} from "next/app";
import {SessionProvider} from "next-auth/react";
import AuthButton from "@/pages/api/components/AuthButton";

export default function App({Component, pageProps}: AppProps) {
    return (
        <SessionProvider session={pageProps.session}>
            <AuthButton/>
            <Component {...pageProps} />
        </SessionProvider>
    );
}