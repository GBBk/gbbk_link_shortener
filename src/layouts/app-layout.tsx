import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
    return (
        <div className="min-h-screen">
            <Header/>
            <main className="min-h-screen container mx-auto">
                <Outlet />
            </main>
            <div className="p-10 text-center bg-gray-800 mt-10">
                Made with ❤️
            </div>
        </div>
    );
}

export default AppLayout;