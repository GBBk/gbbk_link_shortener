import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DeviceStats from "@/components/DeviceStats"
import { UrlState } from "@/context"
import { getClicksInfoForUrl } from "@/db/apiClicks"
import { deleteUrl, getUrlInfo } from "@/db/apiUrls"
import useFetch from "@/hooks/useFetch"
import { Copy, Download, LinkIcon, Trash } from "lucide-react"
import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { BarLoader, BeatLoader } from "react-spinners"
import LocationStats from "@/components/LocationStats"

const Link = () => {

  const {id} = useParams()
  const {user} = UrlState()
  const navigate = useNavigate()

  const { loading, data: url, fn, error} = useFetch(getUrlInfo, {id, user_id: user?.id})
  const { loading: loadingStats, data: stats, fn: fnStats} = useFetch(getClicksInfoForUrl, id)
  const { loading: loadingDelete, fn: fnDelete} = useFetch(deleteUrl, url?.id)

      const downloadImage = () => {
        const imageUrl = url?.qr
        const fileName = url?.title

        const anchor = document.createElement("a");
        anchor.href = imageUrl;
        anchor.download = fileName;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        
    }

  useEffect(() => {
    fn()
    fnStats()
  }, [])

  if(error){
    navigate("/dashboard")
  }

  let link = ""
  if(url) {
    link = `https://www.gbbk.arg/${url.custom_url ? url.custom_url : url.short_url}`
  }

  return (
    <>
      {(loading || loadingStats) && <BarLoader width={"100%"} color="#36d7b7" className="mb-4"/>}
      <div className="flex flex-col gap-8 sm:flex-row justify-between">
        <div className="flex flex-col items-start gap-8 rounded-lg sm:w-2/5">
          <span className="text-6xl font-extrabold hover:underline cursor-pointer">{url?.title}</span>
          <a href={link} target="_blank" className="text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer">{link}</a>
          <a href={url?.original_url} target="_blank" className="flex items-center gap-1 hover:underline cursor-pointer">
            <LinkIcon className="p-1"/>
            {url?.original_url}
          </a>
          <span className="flex items-end font-extralight text-sm">{new Date(url?.created_at).toLocaleString()}</span>
          <div className="flex gap-2">
              <Button variant="ghost" onClick={()=> navigator.clipboard.writeText(`https://wwww.gbbk.arg/${url?.short_url}`)}><Copy /></Button>
              <Button variant="ghost" onClick={downloadImage}><Download /></Button>
              <Button variant="ghost" onClick={()=>fnDelete()}>
                  {
                      loadingDelete ? <BeatLoader size={5} color="#ffffff" /> : <Trash />
                  }
              </Button>
          </div>
          <img src={url?.qr} alt="qr code" className="w-full self-center sm:self-start ring ring-blue-500 p-1 object-contain"/>
        </div>
        <div className="sm:w-3/5">
          <Card>
            <CardHeader>
              <CardTitle className="text-4xl font-extrabold">Stats</CardTitle>
            </CardHeader>
            <CardContent>
              {stats && stats?.length ? (
                <CardContent className="flex flex-col gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Total Clicks</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{stats?.length}</p>
                    </CardContent>
                  </Card>
                  <CardTitle className="text-3xl">Location Data</CardTitle>
                  <LocationStats stats={stats}/>
                  <CardTitle className="text-3xl">Device Info</CardTitle>
                  <DeviceStats stats={stats}/>
                </CardContent>
              ) : (
                <CardContent>
                  {loadingStats === false ? "No stats yet" : "Loading stats..."}
                </CardContent>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default Link