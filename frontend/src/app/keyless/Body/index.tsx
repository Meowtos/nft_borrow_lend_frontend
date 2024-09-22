"use client"
import { useEffect, useRef } from "react"
import { useKeylessAccounts } from "@/core/useKeylessAccounts";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/themecontext";
import { toast } from "sonner";
export function Body() {
    const { theme } = useTheme();
    const router = useRouter()
    const isLoading = useRef(false);

    const switchKeylessAccount = useKeylessAccounts(
        (state) => state.switchKeylessAccount
    );
   
    useEffect(() => {
        // This is a workaround to prevent firing twice due to strict mode
        async function deriveAccount(idToken: string) {
            try {
                await switchKeylessAccount(idToken);
                router.push("/");
            } catch (error: unknown) {
                let errorMessage = typeof error === "string" ? error : `An unexpected error has occured`;
                if (error instanceof Error) {
                    errorMessage = error.message;
                }
                toast.error(errorMessage)
            } finally {
                router.push("/")
            }
        }
        if(typeof window !== undefined){
            const fragmentParams = new URLSearchParams(window.location.hash.substring(1));
            const idToken = fragmentParams.get("id_token");
            if (!idToken) {
                router.push("/");
                return;
            }
            deriveAccount(idToken);
        }
        
    }, [isLoading, router, switchKeylessAccount]);
    return (
        <section className={`inner-banner ${theme == 'light' ? 'light-theme' : 'dark-theme'}`}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 text-center">
                        Redirecting...
                    </div>
                </div>
            </div>
        </section>
    )
}