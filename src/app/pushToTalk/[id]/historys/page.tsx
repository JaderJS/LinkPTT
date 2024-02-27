import HistoryComponent from "@/components/historys";

export default function ({ params }: { params: { id: string } }) {
    return (
        <>HISTORICOO{params.id}
            <HistoryComponent />
        </>
    )
}