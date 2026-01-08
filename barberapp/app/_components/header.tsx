import { Card, CardContent } from "@/app/_components/ui/card";
import Image from "next/image";
import { Button } from "@/app/_components/ui/button";
import { MenuIcon } from "lucide-react";

const Header = () => {
  return (
    <Card>
      <CardContent className="p-5 justify-between items-center flex flex-row">
        <Image src="/logo.png" alt="Logo" height={18} width={120} />
        <Button variant="outline" size="icon" className="h-7 w-7">
          <MenuIcon size={16} />
        </Button>
      </CardContent>
    </Card>
  );
};

export default Header;
