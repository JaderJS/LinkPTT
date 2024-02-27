import { io } from "@/socket/socket"
import { RefObject, useEffect, useRef, useState } from "react"

//https://www.youtube.com/watch?v=HwvbEVuMwTA

const useRecorder = () => {
    const [status, setStatus] = useState<"idle" | "recording" | "paused">("idle")
    const [blob, setBlob] = useState<Blob | undefined>(undefined)
    const [blobUrl, setBlobUrl] = useState('')
    const [stream, setStream] = useState<MediaStream | undefined>(undefined)
    const [recorder, setRecorder] = useState<MediaRecorder | undefined>(undefined)

    const audioRef = useRef() as RefObject<HTMLAudioElement>

    useEffect(() => {
        if (status === "recording" && stream && audioRef.current) {
            audioRef.current.srcObject = stream
        }

    }, [status, audioRef.current, stream])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true
            })
            setStream(stream)
            const mediaRecorder = new MediaRecorder(stream)
            setRecorder(mediaRecorder)

            const chunks: Blob[] = []

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunks.push(e.data)
            }

            mediaRecorder.onstart = () => {
                if (audioRef.current) {
                    audioRef.current.play()
                }
            }
            mediaRecorder.onstop = () => {

                const completeBlob = new Blob(chunks, { type: "audio/wav; codecs=opus" })
                io.emit("message", completeBlob)
                setBlob(completeBlob)

                const videoUrl = URL.createObjectURL(completeBlob)
                setBlobUrl(videoUrl)

                if (audioRef.current) {
                    audioRef.current.pause()
                }
            }

            mediaRecorder.start()
            setStatus("recording")
        } catch (error) {
            console.error(error)
        }
    }

    const stopRecording = async () => {
        if (recorder) {
            recorder.stop()
            recorder.stream.getTracks().map(track => track.stop())
            setRecorder(undefined)
            setStream(undefined)
            setStatus("idle")
        }
    }

    return { blob, blobUrl, startRecording, stopRecording, audioRef }
}

export default useRecorder