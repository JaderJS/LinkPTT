"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactNode, useState } from "react"
import { ThemeProvider } from "./theme"
import { SocketProvider } from "./socket"

export default function Provider({ children }: { children: ReactNode }) {

    const [queryClient] = useState(() => new QueryClient())

    return (
        <QueryClientProvider client={queryClient} >
            <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
            >
                <SocketProvider>
                    {children}
                </SocketProvider>
            </ThemeProvider>
        </QueryClientProvider>
    )

}