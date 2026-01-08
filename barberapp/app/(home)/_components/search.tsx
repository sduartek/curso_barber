"use client";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/(home)/_components/input";
import { SearchIcon } from "lucide-react";


const Search = () => {
    return (
        <div className="flex items-center gap-2">
            <Input placeholder="Busque por uma barbearia..." />
            <Button variant="default">
                <SearchIcon size={18} />
            </Button>
        </div>
    );
}

export default Search;