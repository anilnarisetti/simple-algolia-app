import Head from "next/head";
import Image from "next/image";
import {Inter} from "next/font/google";
import styles from "@/styles/Home.module.css";
import {getSession, useSession} from "next-auth/react";
import {GetServerSideProps} from "next";
import {Session} from "next-auth";
import {AlgoliaIndexRules} from "@/pages/api/types/algolia";
import algoliasearch, {SearchClient} from "algoliasearch";
import getRulesForIndex from "@/pages/api/algolia/getRulesForIndex";
import {GetApiKeyResponse, Index} from "@algolia/client-search";

const inter = Inter({subsets: ["latin"]});

type HomeProps = {
    session: Session | null;
    apiKeys: {
        keys: GetApiKeyResponse[];
    },
    indices: {
        items: Index[];
        nbPages: number;
    };
    indexRules: AlgoliaIndexRules[] | null;
};

const Home = (props: HomeProps) => {
    const {
        session,
        apiKeys,
        indices,
        indexRules} = props;

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
                    <div>
                        {apiKeys?.keys?.map((key, index) => (
                            <div key={index}>
                                <h2 className={`${inter.className}`}>
                                    API Key: {key.value}
                                </h2>
                                <pre>{key.description}</pre>
                            </div>
                        ))}
                    </div>
                    <div>
                        {
                            indices?.items?.map((algIndex, index) => (
                                <div key={index}>
                                    <h2 className={`${inter.className}`}>
                                        Index: {algIndex.name}
                                    </h2>
                                </div>
                            ))
                        }
                    </div>
                    <div>
                        {
                            indexRules?.map((rule, index) => (
                                <div key={index}>
                                    <h2 className={`${inter.className}`}>
                                        Rule for: {rule.indexName}
                                    </h2>
                                    {
                                        rule.rules.map((rule, index) => (
                                            <div key={index}>
                                                <pre>{JSON.stringify(rule, null, 2)}</pre>
                                            </div>
                                        ))
                                    }
                                </div>
                            ))
                        }
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

    const APP_ID = process.env.ALGOLIA_APPLICATION_ID || "";
    const ADMIN_KEY = process.env.ALGOLIA_ADMIN_API_KEY || "";
    const client = algoliasearch(APP_ID, ADMIN_KEY);

    const apiKeysPromise = client.listApiKeys();
    const indicesPromise =  client.listIndices();

    // Await all at once for efficiency
    const [apiKeys, indices] = await Promise.all([apiKeysPromise, indicesPromise]);

    //Fetch rules for each index
    const rulesPromises = indices?.items.map(index => getRulesForIndex(index.name, client));
    const indicesRules = await Promise.all(rulesPromises);

    return {
        props: {
            session,
            apiKeys: {
                items: apiKeys.keys || [],
            },
            indices: {
                nbPages: indices.nbPages || 0,
                items: indices.items || [],
            },
            indexRules: indicesRules, // Ensure this is correctly typed to be serializable
        },
    };
};

export default Home;