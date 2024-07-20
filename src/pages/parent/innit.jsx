import {
    Card,
    CardHeader,
    CardBody,
    Typography,
} from "@material-tailwind/react";
import { UserIcon } from "@heroicons/react/24/solid";
import { ordersOverviewData } from "@/data";
import { format, setHours, setMinutes, startOfWeek, addDays } from 'date-fns';
import { useUser } from '@/context/UserContext';
import { CalendarSection } from "@/widgets/components";
import React from "react";


export function Innit() {

    const { user } = useUser();

    console.log(user)

    const formatHorarios = (horarios) => {
        const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });

        return horarios.map((horario, index) => {
            const [inicioHora, inicioMinutos] = horario.inicio.split(":");
            const [finHora, finMinutos] = horario.fin.split(":");

            const startDay = addDays(currentWeekStart, horario.dia - 1);
            const endDay = addDays(currentWeekStart, horario.dia - 1);

            const startDate = setMinutes(setHours(startDay, parseInt(inicioHora)), parseInt(inicioMinutos));
            const endDate = setMinutes(setHours(endDay, parseInt(finHora)), parseInt(finMinutos));

            return {
                id: index.toString(),
                title: horario.materia.nombre,
                subtitle: horario.docente.nombre,
                startDate,
                endDate,
            };
        });
    };

    return (
        <>
            <div className="mt-12 mb-8 flex flex-col md:flex-row gap-10">
                <div className="flex-grow">
                    <Card>
                        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                            <Typography className="text-center" variant="h6" color="white">
                                Horario
                            </Typography>
                        </CardHeader>
                        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                            <CalendarSection events={formatHorarios(user.horarios || [])} />
                        </CardBody>
                    </Card>
                </div>
                <div className="w-full md:w-1/4 md:max-w-lg sm:mt-10 md:mt-0">
                    <Card className="border border-blue-gray-100 shadow-sm">
                        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
                            <Typography variant="h6" color="white" className="mb-2">
                                Companeros
                            </Typography>
                        </CardHeader>
                        <CardBody className="pt-0">
                                {user.alumnos
                                    ?.filter((alumno) => alumno.estado === 1)
                                    .map(({ nombre, apellido, dni }, key) => (
                                        <div key={dni} className="flex items-start gap-4 py-3">
                                            <div
                                                className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${key === user.alumnos.length - 1
                                                    ? "after:h-0"
                                                    : "after:h-4/6"
                                                    }`}
                                            >
                                                <UserIcon className="!w-5 !h-5 text-blue-gray-300" />
                                            </div>
                                            <div>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="block font-medium"
                                                >
                                                    {nombre} {apellido}
                                                </Typography>
                                                <Typography
                                                    as="span"
                                                    variant="small"
                                                    className="text-xs font-medium text-blue-gray-300"
                                                >
                                                    {dni}
                                                </Typography>
                                            </div>
                                        </div>
                                    ))}
                            </CardBody>
                    </Card>
                </div>
            </div>
        </>
    );
}

export default Innit;
