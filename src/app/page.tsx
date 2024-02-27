'use client'

import HistoryComponent from "@/components/historys"
import { Button } from "@/components/ui/button"
import useRecorder from "@/hooks/useRecorder"
import { io } from "@/socket/socket"
import { RefObject, useEffect, useRef } from "react";

export default function Home() {

  const { blob, blobUrl, startRecording, stopRecording, audioRef } = useRecorder()


  useEffect(() => {
    io.on("message", (data: Blob) => {
      const blob = new Blob([data], { type: "audio/ogg; codecs=opus" })
    })

  })

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 style={{ fontSize: "3rem" }}>CAMERA PARA O AMOR DA VIDA DE JADER!! </h1>
      <HistoryComponent />
      <audio ref={audioRef} controls>
      </audio>
      <Button onClick={startRecording}>REC</Button>
      <button onClick={stopRecording}>STOP</button>
    </main>
  );
}
