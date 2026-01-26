import { Link, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { LOGO } from "../constants/constants"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/context";
import { logout } from "@/db/apiAuth";
import useFetch from "@/hooks/useFetch";
import { BarLoader } from "react-spinners";


const Header = () => {
    const navigate = useNavigate();
    const { user, fetchUser } = UrlState();

    const {loading, fn: fnLogout} = useFetch(logout);

    const handleLogout = async () => {
        try {
            await fnLogout();
            fetchUser();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            <nav className="p-4 flex justify-between items-center ">
                <Link to="/">
                    <img src={LOGO} className="h-20" alt="GBBk logo" />
                </Link>
                <div>
                    {
                        !user ? (
                            <Button onClick={() => navigate("/auth")}>Login</Button>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger className="w-10 rounded-full overflow-hidden">
                                    <Avatar>
                                        <AvatarImage src={user?.user_metadata?.profile_pic} className="object-contain" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>    
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel className="text-center">{user?.user_metadata?.name}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <Link to="/dashboard" className="flex">
                                        <LinkIcon className="mr-2 h-4 w-4"/>
                                        <span>My Links</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-400">
                                        <LogOut className="mr-2 h-4 w-4"/>
                                        <span onClick={handleLogout}>Logout</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    }
                    
                </div>
                
            </nav>
            {loading && <BarLoader color="#36d7b7" className="mb-4" width={"100%"} />}
        </>
    )
}

export default Header