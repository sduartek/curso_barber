"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { format } from "date-fns/format";
import { saveBooking } from "../_actions/save-booking";
import { addDays, setHours, setMinutes } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/dist/client/components/navigation";
import { getDayBookings } from "../_actions/get-day-bookings";
import BookingInfo from "@/app/_components/booking-info";

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Omit<Service, "price"> & {
    price: number;
  };
  isAuthenticated: boolean;
}

const ServiceItem = ({ service, barbershop, isAuthenticated }: ServiceItemProps) => {
  const router = useRouter();
  const {data} = useSession();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState<string | undefined>();
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [sheetIsOpen, setSheetIsOpen] = useState(false);
  const [dayBookings, setDayBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (!date) {
      return
    };

    const refreshAvailableHours = async () => {
      const _dayBookings = await getDayBookings(barbershop.id, date);

      setDayBookings(_dayBookings);
    };

    refreshAvailableHours();
  }, [date, barbershop.id]);

  const handleDateClick = (date: Date | undefined) => {
    setDate(date);
    setHour(undefined);
  };

  const handleHourClick = (time: string) => {
    setHour(time);
  };

  const handleBookingClick = () => {
    if (!isAuthenticated) {
      return signIn("google");
    }

    
  };

  const handleBookingSubmit = async () => {
    setSubmitIsLoading(true);
    try {
      if (!hour || !date || !data?.user) {
        return;
      }
      const dateHour = Number(hour.split(":")[0]);
      const dateMinute = Number(hour.split(":")[1]);

      const newDate = setMinutes(setHours(date, dateHour), dateMinute);

      await saveBooking({
        barbershopId: barbershop.id,
        serviceId: service.id,
        date: newDate,
        userId: data.user.id,
      });

      setSheetIsOpen(false);
      setHour(undefined);
      setDate(undefined);
      toast.success("Reserva realizada com sucesso!", {
        description: format(newDate, "dd 'de' MMMM 'às' HH:mm", {
          locale: ptBR,
        }),
        action: {
          label: "Visualizar",
          onClick: () => router.push("/bookings"),
        },
      });

    } catch (error) {
      console.log("Error ao salvar reserva:", error);
    } finally {
      setSubmitIsLoading(false);
    }
  };

  const timeList = useMemo(() => {
   if (!date) {
    return [];
   }
    return generateDayTimeList(date).filter((time) => {
      const timeHour = Number(time.split(":")[0]);
      const timeMinute = Number(time.split(":")[1]);

      const booking = dayBookings.find((booking) => {
        const bookingDate = booking.date.getHours();
        const bookingMinute = booking.date.getMinutes();
        return bookingDate === timeHour && bookingMinute === timeMinute;
      });
      if (!booking) {
        return true;
      }
      return false;
    });
  }, [date, dayBookings]);

  return (
    <Card>
      <CardContent className="p-3 w-full">
        <div className="flex gap-4 items-center w-full">
          <div className="relative min-h-[110px] min-w-[110px] max-h-[110px] max-w-[110px]">
            <Image
              className="rounded-lg"
              src={service.imageURL}
              fill
              style={{ objectFit: "contain" }}
              alt={service.name}
            />
          </div>
          <div className="flex flex-col w-full">
            <h2 className="font-bold">{service.name}</h2>
            <p className="text-sm text-gray-400">{service.description}</p>

            <div className="flex items-center justify-between mt-3">
              <p className="font-bold text-sm text-primary">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(service.price)}
              </p>
              <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-6 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div>
                    <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateClick}
                    locale={ptBR}
                    disabled={{ before: addDays(new Date(), 1) }}
                    className="w-full py-0"
                    
                  />
                  </div>

                  {date && (
                    <div className="flex gap-3 overflow-x-auto overflow-y-hidden py-3 px-3 border-t [&::-webkit-scrollbar]:hidden">
                      {timeList.map((time) => (
                        <Button
                          onClick={() => handleHourClick(time)}
                          variant={hour === time ? "default" : "outline"}
                          className="rounded-full"
                          key={time}
                        >
                          {time}
                        </Button>
                      ))}
                    </div>
                  )}

                 <BookingInfo booking={{
                  barbershop: barbershop,
                  date: date && hour ? 
                  setMinutes(setHours(date, Number(hour.split(":")[0])), Number(hour.split(":")[1])) 
                  : undefined,
                  service: service,
                 }} />

                  <div>
                    <SheetFooter className="px-3 py-1">
                    <Button onClick={handleBookingSubmit} disabled={(!date || !hour || submitIsLoading)}>{submitIsLoading ? "Confirmando..." : "Confirmar Reserva"}</Button>
                  </SheetFooter>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceItem;

