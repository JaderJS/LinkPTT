import { ReactNode, createContext, useContext, useMemo } from "react"
import { Socket, io } from "socket.io-client"

const SocketContext = createContext<Socket | null>(null)

export const SocketProvider = ({ children }: { children: ReactNode }) => {

    const socket = useMemo(() => io(process.env.URL_SOCKET || ""), [])

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}
export const useSocket = () => {
    const socket = useContext(SocketContext)
    return socket
}