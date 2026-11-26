import { storeClicks } from "@/db/apiClicks"
import { getLongUrl } from "@/db/apiUrls"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { BarLoader } from "react-spinners"

const RedirectLink = () => {
  const { id } = useParams()
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    let cancelled = false

    getLongUrl(id)
      .then((url) => {
        if (!cancelled) return storeClicks({ id: url.id, originalUrl: url.original_url })
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })

    return () => {
      cancelled = true
    }
  }, [id])

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-4xl font-extrabold">Link not found</h1>
        <p>This short link doesn't exist or was deleted.</p>
        <Link to="/" className="text-blue-400 hover:underline">Go to home page</Link>
      </div>
    )
  }

  return (
    <>
      <BarLoader width={"100%"} color="#36d7b7" />
      <br />
      Redirecting...
    </>
  )
}

export default RedirectLink
