import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UrlState } from "@/context";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"

const Auth = () => {

  const [searchParams] = useSearchParams();
  const longLink = searchParams.get("createNew");
  const navigate = useNavigate();

  const { isAuthenticated, loading } = UrlState();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate(`/dashboard${longLink ? `?createNew=${encodeURIComponent(longLink)}` : ''}`);
    }
  }, [isAuthenticated, loading]);

  return (
    <div className="mt-20 flex flex-col items-center gap-10">
      <h1 className="text-5xl font-extrabold">
        {longLink ? "Wait, let's login first" : "Login / Signup"}
      </h1>
      <Tabs defaultValue="login" className="w-100">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="signup">Signup</TabsTrigger>
        </TabsList>
        <TabsContent value="login"><Login/></TabsContent>
        <TabsContent value="signup"><Signup/></TabsContent>
      </Tabs>     
    </div>
  )
}

export default Auth