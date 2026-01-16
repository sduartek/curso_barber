import { db } from "@/app/_lib/prisma";
import BarbershopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";

interface BarbershopDetailsPageProps {
    params: {
        id: string;
    };
}


const BarbershopDetailsPage = async ({params} : BarbershopDetailsPageProps) => {
    const session = await getServerSession();
    
    if (!params.id) {
        //to do redirecionar pra home page
        return null;
    }

    const barbershop = await db.barbershop.findUnique({
        where: {
            id: params.id,
        },
        include: { services: true }
    });

    if (!barbershop) { 
        //to do redirecionar pra home page
        return null;
    }

    const plainBarbershop = {
    ...barbershop,
    services: barbershop.services.map((service) => ({
      ...service,
      price: Number(service.price),
    })),
  };


    return (
        <div>
            <BarbershopInfo barbershop={plainBarbershop} />

        <div className="px-5 flex flex-col gap-4 py-6">      
        {plainBarbershop.services.map((service) => (
            <ServiceItem key={service.id} service={service} isAuthenticated={!!session?.user} />
        ))}  
        </div>
        </div>
        
    );
}
 
export default BarbershopDetailsPage;
