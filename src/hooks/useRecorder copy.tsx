import { io } from "@/socket/socket"
import { RefObject, useEffect, useRef, useState } from "react"

const useRecorder = () => {
    const [status, setStatus] = useState<"idle" | "recording" | "paused">("idle")
    const [blob, setBlob] = useState<Blob | undefined>(undefined)
    const [blobUrl, setBlobUrl] = useState('')
    const [stream, setStream] = useState<MediaStream | undefined>(undefined)
    const [recorder, setRecorder] = useState<MediaRecorder | undefined>(undefined)

    const videoRef = useRef() as RefObject<HTMLVideoElement>

    useEffect(() => {
        if (status === "recording" && stream && videoRef.current) {
            videoRef.current.srcObject = stream
        }

    }, [status, videoRef.current, stream])

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
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
                if (videoRef.current) {
                    videoRef.current.play()
                }
            }
            mediaRecorder.onstop = () => {

                const completeBlob = new Blob(chunks, { type: "video/webm" })
                io.emit("message", completeBlob)
                setBlob(completeBlob)

                const videoUrl = URL.createObjectURL(completeBlob)
                setBlobUrl(videoUrl)

                if (videoRef.current) {
                    videoRef.current.pause()
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

    return { blob, blobUrl, startRecording, stopRecording, videoRef }
}

export default useRecorder