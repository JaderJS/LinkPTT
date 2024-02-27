import { io as Io } from "socket.io-client"

export const io = Io(`http://localhost:8888`)