"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { History } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const channels = [
    { id: 0, title: "Fazenda", user: { name: "Jader José da Silva", avatarUrl: "https://github.com/JaderJS.png" } },
    { id: 1, title: "Fazenda", user: { name: "Jader José da Silva", avatarUrl: "https://github.com/JaderJS.png" } },
    { id: 2, title: "Fazenda", user: { name: "Jader José da Silva", avatarUrl: "https://github.com/JaderJS.png" } },
    { id: 3, title: "Fazenda", user: { name: "Jader José da Silva", avatarUrl: "https://github.com/JaderJS.png" } },
    { id: 4, title: "Fazenda", user: { name: "Jader José da Silva", avatarUrl: "https://github.com/JaderJS.png" } },
    { id: 5, title: "Fazenda", user: { name: "Jader José da Silva", avatarUrl: "https://github.com/JaderJS.png" } },
    { id: 6, title: "Fazenda", user: { name: "Jader José da Silva", avatarUrl: "https://github.com/JaderJS.png" } },
]

export default function Channels() {
    return (
        <>
            {channels.map((channel) => (
                <ChannelsComponent key={channel.id} channel={channel} />
            ))}
        </>
    )
}

interface channelProps {
    id: number,
    title: string,
    user: {
        name: string,
        avatarUrl: string
    }
}

const ChannelsComponent = ({ channel }: { channel: channelProps }) => {

    const router = useRouter()

    return (
        <>
            <Card className="flex flex-row justify-between p-5 m-2 hover:cursor-pointer" onClick={() => router.push(`/pushToTalk/${channel.id}`)}>

                <div className="flex flex-row space-x-4">
                    <Avatar>
                        <AvatarImage src={channel.user.avatarUrl} />
                        <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-base">{channel.title}</span>
                        <span className="text-sm text-muted-foreground">Desconectado</span>
                    </div>
                </div>
                <div className="py-2">
                    <Button variant="ghost">
                        <History />
                    </Button>
                </div>

            </Card>
        </>
    )
}