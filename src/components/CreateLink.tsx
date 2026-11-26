import { UrlState } from "@/context"

import { useNavigate, useSearchParams } from "react-router-dom"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import Error from "./Error"
import { Card } from "./ui/card"
import { useEffect, useRef, useState } from "react"
import * as yup from "yup"
import { QRCode } from 'react-qrcode-logo';
import useFetch from "@/hooks/useFetch"
import { createUrl } from "@/db/apiUrls"
import { BeatLoader } from "react-spinners"

const CreateLink = () => {

    const { user } = UrlState()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams();
    const longLink = searchParams.get("createNew")

    const ref = useRef<QRCode>(null)

    const [errors, setErrors] = useState({
        title: "",
        longUrl: "",
        customUrl: ""
    })
    const [formValues, setFormValues] = useState({
        title: "",
        longUrl: longLink ? longLink : "",
        customUrl: ""
    })

    const schema = yup.object().shape({
        title: yup.string().required("Title is required"),
        longUrl: yup.string().url("Invalid URL").required("Long URL is required"),
        customUrl: yup.string()
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({
            ...formValues,
            [e.target.id]: e.target.value
        })
    }

    const { loading, error, data, fn: fnCreateUrl} = useFetch(createUrl, {...formValues, user_id: user?.id ?? ""})

    useEffect(() => {
        if(error === null && data) {
            navigate(`/link/${data[0].id}`)
        }
    },[error, data, navigate])

   const createNewLink = async () => {
        setErrors({
            title: "",
            longUrl: "",
            customUrl: ""
        })
        try {
            await schema.validate(formValues, { abortEarly: false });
            const canvas = (ref.current as unknown as { canvasRef?: React.RefObject<HTMLCanvasElement> })?.canvasRef?.current;
            const blob = canvas
                ? await new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b)))
                : null;
            await fnCreateUrl(blob);
        } catch (error) {
            const newErrors: Record<string, string> = {};
            if (error instanceof yup.ValidationError) {
                error.inner.forEach((err) => {
                    if (err.path) {
                        newErrors[err.path] = err.message
                    }
                });
                setErrors({ title: "", longUrl: "", customUrl: "", ...newErrors });
            }
        }    
    }

  return (
        <Dialog defaultOpen={longLink ? true : false} onOpenChange={(res)=> {if(!res) setSearchParams({})}}>
        <DialogTrigger>
            <Button variant={"destructive"}>Create new link</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md ">
            <DialogHeader>
                <DialogTitle className="font-bold text-2xl">Create New</DialogTitle>
            </DialogHeader>
            {formValues?.longUrl && <QRCode value={formValues.longUrl} size={250} ref={ref}></QRCode>}
                <Input id="title" placeholder="Short Link's Title" value={formValues.title} onChange={handleChange}/>
                {errors.title && <Error message={errors.title as string} />}
                <Input id="longUrl" placeholder="Enter your long URL" value={formValues.longUrl} onChange={handleChange}/>
                {errors.longUrl && <Error message={errors.longUrl as string} />}
                <div className="flex items-center gap-2">
                    <Card className="p-2">{window.location.host}</Card> /
                    <Input id="customUrl" placeholder="Custom Link (optional)" value={formValues.customUrl} onChange={handleChange}/>
                </div>
                {error && <Error message={error.message} />}
                <DialogFooter className="sm:justify-center">
                    <Button disabled={loading} onClick={createNewLink} variant="destructive">
                        {loading ? <BeatLoader size={10} color="#ffffff" /> : "Create Link"}
                    </Button>
                </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default CreateLink