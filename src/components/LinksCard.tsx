import { Link } from "react-router-dom"
import { Button } from "./ui/button"
import { Copy, Download, Trash } from "lucide-react"
import useFetch from "@/hooks/useFetch"
import { deleteUrl } from "@/db/apiUrls"
import { BeatLoader } from "react-spinners"
import { buildShortLink } from "@/lib/links"
import type { Url } from "@/types"

interface LinksCardProps {
    url: Url
    fetchUrls: () => Promise<unknown>
}

const LinksCard = ({ url, fetchUrls }: LinksCardProps) => {
    const shortLink = buildShortLink(url)

    const downloadImage = () => {
        const anchor = document.createElement("a");
        anchor.href = url.qr;
        anchor.download = url.title;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    const { loading: loadingDelete, fn: fnDelete } = useFetch(deleteUrl, url.id);

  return (
    <div className="flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded-lg">
        <img className="h-32 object-contain ring ring-blue-500 self-start" src={url.qr} alt="qr code" />
        <Link to={`/link/${url.id}`} className="flex flex-col gap-2 flex-1">
            <span className="text-3xl font-extrabold hover:underline cursor-pointer">{url.title}</span>
            <span className="text-2xl text-blue-400 font-bold hover:underline cursor-pointer">{shortLink}</span>
            <span className="flex items-center gap-1 hover:underline cursor-pointer">{url.original_url}</span>
            <span className="flex items-end font-extralight text-sm flex-1">{new Date(url.created_at).toLocaleString()}</span>
        </Link>
        <div className="flex gap-2">
            <Button variant="ghost" aria-label="Copiar link" onClick={() => navigator.clipboard.writeText(shortLink)}><Copy /></Button>
            <Button variant="ghost" aria-label="Descargar QR" onClick={downloadImage}><Download /></Button>
            <Button variant="ghost" aria-label="Eliminar link" onClick={() => fnDelete().then(() => fetchUrls())}>
                {
                    loadingDelete ? <BeatLoader size={5} color="#ffffff" /> : <Trash />
                }
            </Button>
        </div>
    </div>
  )
}

export default LinksCard
