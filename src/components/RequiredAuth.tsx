import { UrlState } from "@/context";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";

function RequireAuth({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { isAuthenticated, loading } = UrlState();

    useEffect(() => {
        if(!loading && !isAuthenticated) navigate('/auth');
    },[isAuthenticated, loading]);

    if(loading) return <BarLoader color="#36d7b7" width={"100%"} />;

    if (isAuthenticated) return children
}

export default RequireAuth;