import Head from "next/head";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from "@/styles/Home.module.css";
import {getSession} from "next-auth/react";
import {GetServerSideProps} from "next";
import {Session} from "next-auth";

import IndicesForm from "@/pages/api/components/IndicesForm";

const inter = Inter({subsets: ["latin"]});

type HomeProps = {
    session: Session | null;
};

const Home = (props: HomeProps) => {
    const {session} = props;

    return (
        <>
            <Head>
                <title>Simple Algolia App</title>
                <meta name="description" content="A Simple Algolia App"/>
                <meta name="viewport" content="width=device-width, initial-scale=1"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className={`${styles.main} ${inter.className}`}>
                <div>
                    <h1 className={`${inter.className}`}>
                        Welcome to Simple Algolia App
                    </h1>
                    {session?.user?.image && (
                        <Image
                            className={`${styles.card} ${inter.className}`}
                            src={session.user.image}
                            width={200}
                            height={200}
                            style={{borderRadius: "50%"}}
                            alt="User image"
                        />
                    )}
                    <div className={`${styles.card} ${inter.className}`}/>
                    <div className={`${styles.card} ${inter.className}`}>
                        <h4>Manage Indices</h4>
                        <br/>
                        <IndicesForm/>
                    </div>
                </div>
            </main>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession({req: context.req});

    if (!session) {
        return {
            redirect: {
                destination: '/api/auth/signin',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
        },
    };
};

export default Home;