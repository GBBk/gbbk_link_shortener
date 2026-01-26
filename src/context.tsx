import { createContext, useContext, useEffect } from "react";
import useFetch from "./hooks/useFetch";
import { getCurrentUser } from "./db/apiAuth";

interface UrlContextType {
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  fetchUser: () => Promise<any>;
}

const UrlContext = createContext<UrlContextType | null>(null);

const UrlProvider = ({ children }: { children: React.ReactNode }) => {
    const { data: user, loading, fn:fetchUser  } = useFetch(getCurrentUser);

    const isAuthenticated = user?.role === 'authenticated';

    useEffect(() => {
        fetchUser();
    },[]);

    return (
        <UrlContext.Provider value={{ user, fetchUser, isAuthenticated, loading }}>
            {children}
        </UrlContext.Provider>
    )
}

export const UrlState = () => {
    const context =useContext(UrlContext);
    if (!context) {
        throw new Error("UrlState must be used within a UrlProvider");
    }
    return context;
}

export default UrlProvider;