
"use client"

import { ArrowLeftIcon, PowerIcon, MessageCircle, MoreVertical, Signal, Mic } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

import React, { useEffect } from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useSocket } from "@/provider/socket"
import useRecorder from "@/hooks/useRecorder"


export default function PushToTalk({ params }: { params: { id: string } }) {

    const socket = useSocket()
    const disabled = false

    const [event, setEvent] = useState<"idle" | "receiving" | "transmitting">("idle")
    const { blob, blobUrl, startRecording, stopRecording, audioRef } = useRecorder()

    const handleTouchPttDown = async () => {
        new Promise(resolve => setTimeout(resolve, 2000))
        startRecording()
        setEvent(() => "transmitting")
    }

    const handleTouchPttUp = async () => {
        stopRecording()
        setEvent(() => "idle")
    }

    useEffect(() => {

        socket?.on("message", (data) => {
            console.log(data)
        })

        return () => {
            socket?.off("message")
        }

    }, [])

    return (
        <>
            <div className="flex flex-col min-h-screen items-center justify-center p-5 bg-slate-800">

                <div className="w-[520px] flex flex-col flex-grow bg-zinc-800 ring-1 ring-slate-700">

                    <div className="flex flex-row justify-between bg-zinc-700 p-2">
                        <Link href="/channels" className="p-4">
                            <ArrowLeftIcon className="w-4 h-4" />
                        </Link>

                        <div className="space-x-2 ">
                            <Button variant="ghost">
                                <PowerIcon className="w-4 h-4 text-emerald-500 hover:animate-in" />
                            </Button>

                            <Button variant="ghost">
                                <MessageCircle className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-row justify-between bg-zinc-900 p-4">
                        <div className="flex flex-row gap-2">
                            <Avatar>
                                <AvatarImage src="https://github.com/JaderJS.png" />
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>

                            <div className="flex flex-col px-4">
                                <span className="text-base">Fazenda</span>
                                <span className="text-sm text-muted-foreground">Desconectado</span>
                                <span className="text-xs text-muted"># {params.id}</span>
                            </div>
                        </div>

                        <Button variant="ghost" >
                            <MoreVertical className="w-4 h-4" />
                        </Button>
                    </div>

                    {event}
                    <main className="flex flex-grow justify-center items-center">
                        <ButtonPtt
                            disabled={disabled}
                            onMouseDown={() => handleTouchPttDown()}
                            onMouseUp={() => handleTouchPttUp()}
                            variant={event}
                            className="group rounded-full w-80 h-80"
                        >
                            <Mic className=" w-10 h-10 group-hover:animate-pulse duration-75" />
                        </ButtonPtt>
                    </main>

                    <footer className="flex flex-row justify-between p-4">
                        <span />
                        <Badge>{socket?.active ? "Ativo" : "Desativado"}</Badge>
                        <div className="">
                            <Signal className="w-6 h-6 text-white" />
                        </div>
                    </footer>

                </div>

            </div>

        </>
    )
}



const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                idle: "bg-primary text-primary-foreground hover:bg-primary/90 ring-4 ring-emerald-400",
                transmitting: "bg-primary text-primary-foreground hover:bg-primary/90 ring-8 ring-red-400 ",
                receiving: "bg-primary text-primary-foreground hover:bg-primary/90"
            },
            size: {
                default: "h-10 px-4 py-2",
            },
        },
        defaultVariants: {
            variant: "idle",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const ButtonPtt = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
ButtonPtt.displayName = "Button"
