import { isAuthenticated } from "@/lib/actions/auth.actions";
import { redirect } from "next/navigation";
import { ReactNode } from "react"
import { unstable_noStore as noStore } from "next/cache";

const AuthLayout = async ({ children }: { children: ReactNode }) => {
    noStore();
    const isUserAuthenticated = await isAuthenticated();

    if (isUserAuthenticated) redirect('/');

    return (
        <div className="auth-layout">{children}</div>
    )
}

export default AuthLayout