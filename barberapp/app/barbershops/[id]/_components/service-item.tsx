"use client";

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import { Barbershop, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { generateDayTimeList } from "../_helpers/hours";
import { format } from "date-fns/format";

interface ServiceItemProps {
  barbershop: Barbershop;
  service: Omit<Service, "price"> & {
    price: number;
  };
  isAuthenticated: boolean;
}

const ServiceItem = ({ service, barbershop, isAuthenticated }: ServiceItemProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [hour, setHour] = useState<string | undefined>();

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

    // To do: implementar fluxo de agendamento
  };

  const timeList = useMemo(() => {
    return date ? generateDayTimeList(date) : [];
  }, [date]);

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
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" onClick={handleBookingClick}>
                    Reservar
                  </Button>
                </SheetTrigger>

                <SheetContent className="p-0">
                  <SheetHeader className="text-left px-6 py-6 border-b border-solid border-secondary">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={handleDateClick}
                    locale={ptBR}
                    disabled={{ before: new Date() }}
                    className="w-full"
                    classNames={{
                      months: "w-full",
                      caption: "w-full relative h-10",
                      caption_label: "text-sm font-medium capitalize z-10",
                      table: "w-full",
                      head_cell: "w-full",
                      row: "flex w-full",
                      cell: "w-full",
                      day: "w-full hover:bg-primary hover:text-white",
                      nav: "flex justify-between",
                      nav_button_previous:
                        "absolute left-1 top-0 bottom-0 my-auto",
                      nav_button_next:
                        "absolute right-1 top-0 bottom-0 my-auto",
                    }}
                  />

                  {date && (
                    <div className="flex gap-3 overflow-x-auto py-6 px-3 border-y border-solid border-secondary [&::-webkit-scrollbar]:hidden">
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

                  <div className="py-6 px-5 border-t border-solid border-secondary">
                    <Card>
                      <CardContent className="p-3">
                        <div className="flex justify-between">
                          <h2 className="font-bold">{service.name}</h2>
                          <h3 className="font-bold text-sm">
                            {" "}
                            {Intl.NumberFormat("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            }).format(service.price)}
                          </h3>
                        </div>

                       {date && (
                         <div className="flex justify-between">
                          <h3 className="text-gray-400">Data</h3>
                          <h4 className="text-sm">{format(date, "dd 'de' MMMM", {
                            locale: ptBR,
                          })}</h4>
                        </div>
                       )}

                       {hour && (
                         <div className="flex justify-between">
                          <h3 className="text-gray-400">Horário</h3>
                          <h4 className="text-sm">{hour}</h4>
                        </div>
                       )}

                       <div className="flex justify-between">
                          <h3 className="text-gray-400">Barbearia</h3>
                          <h4 className="text-sm">{barbershop.name}</h4>
                        </div>
                      </CardContent>
                    </Card>
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

/*minuto*/
