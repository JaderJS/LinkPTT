
import { useQuery } from "@tanstack/react-query"
import axios from "axios"

export default function HistoryComponent() {

    const { data: histories, isPending } = useQuery<{ data: { data: { id: number, blob: string, filePath: string }[] } }>({
        queryKey: ["histories"],
        queryFn: async ({ signal }) => await axios.get(`http://localhost:8888/api/storages`, { signal })
    })

    console.log(histories?.data)

    if (isPending) {
        return <h1>loading...</h1>
    }

    return (
        <>
            <h3>Histórico</h3>
            {histories?.data.data.map((history) => (
                <audio key={history.id} controls src={history.filePath}>
                    {history.id}
                </audio>
            ))}
        </>
    )
}