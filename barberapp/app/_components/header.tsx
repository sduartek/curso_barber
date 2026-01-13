"use client";

import { Card, CardContent } from "@/app/_components/ui/card";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { MenuIcon } from "lucide-react";
//import { signIn, signOut, useSession } from "next-auth/react";


const Header = () => {
 // const {data} = useSession();
 // const handleLoginClick = async () => {
 // await signIn();
 // };

  return (
    <Card>
      <CardContent className="p-5 justify-between items-center flex flex-row">
        <Image src="/logo.png" alt="Logo" height={18} width={120} />
        <Button variant="outline" size="icon" className="h-7 w-7">
          <MenuIcon size={16} />
        </Button>

        {/*{data?.user ? (
          <div>
            <h1>{data.user.name}</h1>
            <Button onClick={() => signOut()}>Logout</Button>            
          </div>
          
        ) : (
          <Button onClick={handleLoginClick}>Login</Button>
        )}*/}

      </CardContent>
    </Card>
  );
};

export default Header;
