"use client";

import { Card, CardContent } from "@/app/_components/ui/card";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { Link, MenuIcon } from "lucide-react";
import {Sheet, SheetContent, SheetTrigger} from "@/app/_components/ui/sheet";

import SideMenu from "./side-menu";

const Header = () => {
  
  return (
    <Card>
      <CardContent className="p-5 justify-between items-center flex flex-row">
        <Link href="/">
          <Image src="/logo.png" alt="Logo" height={18} width={120} />
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon size={16} />
            </Button>
          </SheetTrigger>

          <SheetContent className="p-0">
            <SideMenu />
            
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  );
};

export default Header;


