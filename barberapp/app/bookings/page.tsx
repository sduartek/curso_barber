import { getServerSession } from "next-auth";
import Header from "../_components/header";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/dist/client/components/navigation";
import { db } from "../_lib/prisma";
import BookingItem from "../_components/booking-item";

const BookingsPage = async () => {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/");
    }

    const bookings = await db.booking.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            service: true,
            barbershop: true,
        },
    });


    return (
    <>
    <Header />

    <div className="px-5 py-4">
        <h1 className="text-xl font-bold">Agendamentos</h1>

        <h2>Confirmados</h2>

        <div className="flex flex-col gap-3">
            {bookings.map((booking) => (
            <BookingItem key={booking.id} booking={booking} />
            ))}
        </div>
    </div>
        </>
    );
};
 
export default BookingsPage;

//aula 4  14 min