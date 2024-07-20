import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tabs,
  TabsHeader,
  Tab,
  Input,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import citaServicio from '@/services/citaServicio';
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import dayjs from 'dayjs';

export function Meetings() {
  const TABS = [
    {
      label: "Confirmado",
      value: "Confirmado",
    },
    {
      label: "Pendiente",
      value: "Pendiente",
    },
    {
      label: "Cancelado",
      value: "Cancelado",
    },
  ];



  const [activeTab, setActiveTab] = useState("Confirmado");
  const [citas, setCitas] = useState([]);
  const [filtro, setFiltro] = useState('');

  //PARA CARGAR DESDE UN INICIO LA TABLA CON LAS CITAS EN LA BD
  useEffect(() => {
    console.log('Nuevo valor de activeTab:', activeTab)
    fetchCitas();
  }, [activeTab]);

  //METODO PARA TRAER LAS CITAS
  const fetchCitas = async () => {
    try {
      const response = activeTab === 'Confirmado'
        ? await citaServicio.getCitasActivate()
        : activeTab === 'Pendiente'
          ? await citaServicio.getCitasDesactivate()
          : activeTab === 'Cancelado'
            ? await citaServicio.getCitasCancelado()
            : null;
      if (response.data) {
        setCitas(response.data);
      } else {
        console.error('NO SE ENCONTRARON CITAS');
      }
    } catch (error) {
      console.error('ERROR AL ACCEDER A ENCONTRAR CITAS RED', error);
    }
  };

  const citasFiltradas = citas.filter(cita =>
    cita.alumno.nombre.toString().startsWith(filtro) ||
    cita.alumno.apellido.toLowerCase().startsWith(filtro.toLowerCase()) ||
    cita.titulo.toLowerCase().startsWith(filtro.toLowerCase())
  );

  const verificarEstado = (estado) => {
    if (estado === 'Confirmado') {
      setActiveTab('Confirmado');
    } else if (estado === 'Pendiente') {
      setActiveTab('Pendiente');
    } else if (estado === 'Cancelado') {
      setActiveTab('Cancelado');
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6">
          <Typography variant="h6" color="white">
            Citas
          </Typography>
        </CardHeader>
        <div className="relative mb-5">
          <CardHeader floated={false} shadow={false} className="rounded-none">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <Tabs value={activeTab} className="w-full md:w-max">
                <TabsHeader>
                  {TABS.map(({ label, value }) => (
                    <Tab key={value} value={value} onClick={() => verificarEstado(value)}>
                      &nbsp;&nbsp;{label}&nbsp;&nbsp;
                    </Tab>
                  ))}
                </TabsHeader>
              </Tabs>
              <div className="w-full md:w-72">
                <Input
                  label="Search"
                  icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
        </div>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                {["Alumno", "Docente", "Titulo", "Fecha y Hora", "Estado"].map((el) => (
                  <th
                    key={el}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                  >
                    <Typography
                      variant="small"
                      className="font-normal leading-none opacity-70"
                    >
                      {el}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.map((cita, key) => {
                const className = `py-3 px-5 ${key === citasFiltradas.length - 1 ? '' : 'border-b border-blue-gray-50'
                  }`;
                return (
                  <tr key={cita.id}>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {cita.alumno.nombre} {cita.alumno.apellido}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                      {cita.docente.apellido} {cita.docente.alumno}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold"
                      >
                        {cita.titulo}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Typography className="text-xs font-semibold text-blue-gray-600">
                        {dayjs(cita.fecha).format('DD/MM/YYYY')} - {cita.inicio}
                      </Typography>
                    </td>
                    <td className={className}>
                      <Chip
                        variant="gradient"
                        value={cita.estado === 0 ? "Pendiente"
                          : cita.estado === 1 ? "Confirmado" : "Cancelado"}
                        color={cita.estado === 0 ? "yellow"
                          : cita.estado === 1 ? "green" : "red"}
                        className="py-0.5 px-2 text-[11px] font-medium w-fit"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardBody>
      </Card>
    </div>
  )
}

export default Meetings;