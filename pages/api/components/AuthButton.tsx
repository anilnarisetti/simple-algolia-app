import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const AuthButton: React.FC = () => {
    const { data: session } = useSession();

    return (
        <div className="navBar">
            {session ? (
                <>
                    <p>Welcome, {session.user?.name || "Guest"}!</p>
                    <button onClick={() => signOut()}>Sign out</button>
                </>
            ) : (
                <button onClick={() => signIn()}>Sign in</button>
            )}
        </div>
    );
};

export default AuthButton;