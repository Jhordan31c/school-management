import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Button,
  Chip,
  Tooltip,
  Progress, Tabs,
  TabsHeader,
  Tab,
  Input,
  Select,
  Option,
  IconButton
} from "@material-tailwind/react";
import { PencilIcon, UserPlusIcon, EllipsisVerticalIcon, ChevronLeftIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/solid";
import React, { useState, useEffect, Fragment } from "react";
import { MagnifyingGlassIcon, ClipboardDocumentCheckIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData, datas, studentInfo } from "@/data";
import { useLocation } from 'react-router-dom';
import docenteServicio from "@/services/docenteServicio";
import { useNavigate } from 'react-router-dom';
import { Transition, TransitionChild, Dialog, DialogTitle } from "@headlessui/react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export function Score() {
  const location = useLocation();

  const { aulaElegida, userId, aulaId, materiaId, idDocente } = location.state || {};
  const [aulaElegidaState, setAulaElegida] = useState(aulaElegida);
  const [selectedNotasAlumno, setSelectedNotasAlumno] = useState(null);
  const [selectedBimestre, setSelectedBimestre] = useState(1);
  const [notasAlumnos, setNotasAlumnos] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isNotasUpdated, setIsNotasUpdated] = useState(false);
  const [filtro, setFiltro] = useState('');

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = (alumno) => {
    setSelectedNotasAlumno(alumno);
    setSelectedBimestre(1); // Establece el bimestre inicial a 1
    setIsOpen(true);
  };

  const headerText = aulaElegida
    ? `${aulaElegida[0].nivel} - Calificaciones de ${aulaElegida[0].materia}: ${aulaElegida[0].grado}-${aulaElegida[0].subGrado} `
    : "Calificaciones";

  const alumnosConPromedios = aulaElegida ? aulaElegida.map(alumno => {
    const promedioBimestral = alumno.bimestres.map(bimestre => (
      (bimestre.nota1 + bimestre.nota2 + bimestre.nota3 + bimestre.nota4) / 4
    ));

    const promedioPonderado = (
      promedioBimestral.reduce((acc, promedio) => acc + promedio, 0) / promedioBimestral.length
    ).toFixed(2);

    return {
      ...alumno,
      promedioBimestral,
      promedioPonderado,
    };
  }) : [];

  const handleEditarNotas = (alumno) => {
    setSelectedNotasAlumno(alumno);
    setIsOpen(true);
    setSelectedBimestre(1);
  };

  const handleBimestreChange = (value) => {
    setSelectedBimestre(parseInt(value));
  };

  const notasDelBimestre = selectedNotasAlumno
    ? selectedNotasAlumno.bimestres.find(
      (bimestre) => bimestre.orden === selectedBimestre
    )
    : { nota1: 0, nota2: 0, nota3: 0, nota4: 0 };

  const handleGuardarNotas = () => {
    closeModal();
  };

  const handleActualizarNotas = async () => {
    try {
      const updatedNotasAlumnos = notasAlumnos.map(alumno => {
        if (alumno.id === selectedNotasAlumno.id) {
          return {
            ...selectedNotasAlumno,
          };
        } else {
          return alumno;
        }
      });

      const notasParaActualizar = updatedNotasAlumnos.map(alumno => ({
        id: alumno.id,
        alumno: alumno.alumno,
        bimestres: alumno.bimestres.map(bimestre => ({
          id: bimestre.id,
          orden: bimestre.orden,
          nota1: bimestre.nota1,
          nota2: bimestre.nota2,
          nota3: bimestre.nota3,
          nota4: bimestre.nota4
        }))
      }));

      await docenteServicio.actualizarNotas(notasParaActualizar);

      const response = await docenteServicio.getAulasElegida(idDocente, aulaId, materiaId);
      if (response.data) {
        const updatedAulaElegida = response.data;
        setAulaElegida(updatedAulaElegida);

        const updatedNotasIniciales = updatedAulaElegida.map((alumno) => {
          const promedioBimestral = alumno.bimestres.map(
            (bimestre) => (bimestre.nota1 + bimestre.nota2 + bimestre.nota3 + bimestre.nota4) / 4
          );
          const promedioPonderado = (promedioBimestral.reduce((acc, promedio) => acc + promedio, 0) / promedioBimestral.length).toFixed(2);

          return {
            ...alumno,
            promedioBimestral,
            promedioPonderado,
          };
        });

        setNotasAlumnos(updatedNotasIniciales);
        setIsNotasUpdated(true);
        setIsOpen(false);
      } else {
        console.error('No se encontraron datos de aula elegida.');
      }
    } catch (error) {
      console.error('Error al actualizar las notas:', error);
    }
  };

  useEffect(() => {
    if (!aulaElegida) return; // Evitar ejecución si no hay aulaElegida

    const fetchInitialData = async () => {
      try {
        const response = await docenteServicio.getAulasElegida(idDocente, aulaId, materiaId);
        if (response.data) {
          const updatedAulaElegida = response.data;
          setAulaElegida(updatedAulaElegida);

          const updatedNotasIniciales = updatedAulaElegida.map((alumno) => {
            const promedioBimestral = alumno.bimestres.map(
              (bimestre) => (bimestre.nota1 + bimestre.nota2 + bimestre.nota3 + bimestre.nota4) / 4
            );
            const promedioPonderado = (promedioBimestral.reduce((acc, promedio) => acc + promedio, 0) / promedioBimestral.length).toFixed(2);

            return {
              ...alumno,
              promedioBimestral,
              promedioPonderado,
            };
          });

          setNotasAlumnos(updatedNotasIniciales);
          setIsNotasUpdated(true);
        } else {
          console.error('No se encontraron datos de aula elegida.');
        }
      } catch (error) {
        console.error('Error al obtener los datos de aula:', error);
      }
    };

    fetchInitialData();
  }, [aulaElegida, idDocente, aulaId, materiaId]);

  const validarYActualizarNota = (e, bimestreKey) => {
    const value = parseInt(e.target.value);
    if (value < 0 || value > 20) {
      toast.error("Las notas deben estar entre 0 y 20.");
    } else {
      const newNotasDelBimestre = { ...notasDelBimestre, [bimestreKey]: value };
      setSelectedNotasAlumno(prevState => ({
        ...prevState,
        bimestres: prevState.bimestres.map(bimestre =>
          bimestre.orden === selectedBimestre ? newNotasDelBimestre : bimestre
        )
      }));
    }
  };

  const handleFiltroChange = (e) => {
    setFiltro(e.target.value);
  };


  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <div className="relative">
          <div className="absolute top-0 left-0 w-full z-10">
            <CardHeader variant="gradient" color="gray" className="mb-8 p-6 text-center">
              <Typography variant="h6" color="white">
                {headerText}
              </Typography>
            </CardHeader>
          </div>
          <div className="relative mt-20">
            <CardHeader floated={false} shadow={false} className="rounded-none">
              <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="w-full md:w-72">
                  <Input
                    label="Search"
                    icon={<MagnifyingGlassIcon className="h-5 w-5" />}
                    value={filtro}
                    onChange={handleFiltroChange}
                  />
                </div>
              </div>
            </CardHeader>
          </div>
        </div>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto mt-8">
            <thead>
              <tr>
                {["Nombre", "Alumno ", "Bimestre 1", "Bimestre 2", "Bimestre 3", "Bimestre 4", "Promedio Final", "", ""].map((el, index) => (
                  <th
                    key={index}
                    className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-3"
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
              {!aulaElegida ? (
                <tr>
                  <td colSpan="7" className="py-3 px-5 border-b border-blue-gray-50 text-center">
                    <Typography variant="small" className="font-normal leading-none opacity-70">
                      Seleccione un aula para calificar notas
                    </Typography>
                  </td>
                </tr>
              ) : (
                <>
                  {notasAlumnos
                    .filter((alumno) => alumno.alumno.toLowerCase().startsWith(filtro.toLowerCase()))
                    .map((alumno, index) => (
                      <tr key={alumno.id}>
                        {index === 0 ? (
                          // Renderizar la materia solo en la primera fila
                          <td rowSpan={notasAlumnos.length} className="py-3 px-5 border-b border-blue-gray-50 text-center">
                            <Typography className="text-xs font-semibold text-blue-gray-600">
                              {alumno.materia}
                            </Typography>
                          </td>
                        ) : null}
                        <td className="py-3 px-5 border-b border-blue-gray-50">
                          <Typography className="text-xs font-semibold text-blue-gray-600">
                            {alumno.alumno}
                          </Typography>
                        </td>
                        {alumno.bimestres.sort((a, b) => a.orden - b.orden).map((bimestre, index) => (
                          <td key={bimestre.id} className="py-3 px-5 border-b border-blue-gray-50 text-center">
                            <div className="flex justify-center">
                              <Chip
                                variant="ghost"
                                size="sm"
                                value={(alumno.promedioBimestral[index]).toFixed(2)}
                                color={
                                  alumno.promedioBimestral[index] < 10
                                    ? "red"
                                    : alumno.promedioBimestral[index] < 13
                                      ? "yellow"
                                      : "green"
                                }
                              />
                            </div>
                          </td>
                        ))}
                        <td className="py-3 px-5 border-b border-blue-gray-50 text-center">
                          <div className="flex justify-center">
                            <Chip
                              variant="ghost"
                              size="sm"
                              value={alumno.promedioPonderado}
                              color={
                                alumno.promedioPonderado < 10
                                  ? "red"
                                  : alumno.promedioPonderado < 13
                                    ? "yellow"
                                    : "green"
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <Tooltip content="Editar Nota">
                            <IconButton variant="text">
                              <PencilIcon className="h-4 w-4" onClick={() => handleEditarNotas(alumno)} />
                            </IconButton>
                          </Tooltip>
                        </td>
                      </tr>
                    ))}
                </>
              )}
            </tbody>
          </table>
        </CardBody>
      </Card>
      <div>
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
            <div className="min-h-screen px-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="fixed inset-0 bg-black opacity-30" />
              </TransitionChild>
              <span className="inline-block h-screen align-middle" aria-hidden="true">
                &#8203;
              </span>
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl mx-auto">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center">
                    Editar Notas
                  </DialogTitle>
                  <div className="mt-4">
                    <Select label="Bimestre" value={selectedBimestre} onChange={(value) => handleBimestreChange(value)}>
                      {[1, 2, 3, 4].map((bimestre) => (
                        <Option key={bimestre} value={bimestre}>
                          Bimestre {bimestre}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Notas</label>
                    <div className="mt-1">
                      <Input
                        color="gray"
                        label="Participación en clase"
                        type="number"
                        value={notasDelBimestre.nota1}
                        onChange={(e) => validarYActualizarNota(e, 'nota1')}
                      />
                    </div>
                    <div className="mt-4">
                      <Input
                        color="gray"
                        label="Actividades Asignadas"
                        type="number"
                        value={notasDelBimestre.nota2}
                        onChange={(e) => validarYActualizarNota(e, 'nota2')}
                      />
                    </div>
                    <div className="mt-4">
                      <Input
                        color="gray"
                        label="Examen Mensual"
                        type="number"
                        value={notasDelBimestre.nota3}
                        onChange={(e) => validarYActualizarNota(e, 'nota3')}
                      />
                    </div>
                    <div className="mt-4">
                      <Input
                        color="gray"
                        label="Examen Bimestral"
                        type="number"
                        value={notasDelBimestre.nota4}
                        onChange={(e) => validarYActualizarNota(e, 'nota4')}
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="bg-yellow-300 rounded-lg p-3 w-full flex justify-between">
                      <div className="flex">
                        <ClipboardDocumentCheckIcon className="w-6 h-6 mr-2" />
                        <label className="block mb-2 font-bold text-black">
                          Promedio Bimestre:
                        </label>
                      </div>
                      <span className="block mb-2 font-bold text-black">
                        {selectedNotasAlumno && selectedNotasAlumno.bimestres &&
                          selectedNotasAlumno.bimestres.find(bimestre => bimestre.orden === selectedBimestre) &&
                          ((selectedNotasAlumno.bimestres.find(bimestre => bimestre.orden === selectedBimestre).nota1 +
                            selectedNotasAlumno.bimestres.find(bimestre => bimestre.orden === selectedBimestre).nota2 +
                            selectedNotasAlumno.bimestres.find(bimestre => bimestre.orden === selectedBimestre).nota3 +
                            selectedNotasAlumno.bimestres.find(bimestre => bimestre.orden === selectedBimestre).nota4) / 4).toFixed(2)
                        }
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-8 space-x-4">
                    <Button color="red" onClick={closeModal}>Cancelar</Button>
                    <Button color="green" onClick={handleActualizarNotas}>Guardar</Button>
                  </div>
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 p-1 rounded-lg text-gray-500 bg-white hover:bg-gray-50 hover:text-gray-600 w-7 fill-current"
                  >
                    <XMarkIcon />
                  </button>
                </div>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Score;