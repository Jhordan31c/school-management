import React, { useState, useEffect, Fragment } from "react";
import materiasServicio from '@/services/materiasServicio';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Button,
  Tabs,
  TabsHeader,
  Tab,
  Input,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { Transition, TransitionChild, Dialog, DialogTitle } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";



export function Materias() {

  const [showModal, setShowModal] = useState(false);
  const [showModalMaterias, setShowModalMaterias] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState({
    nombre: ''
    // Otros campos si es necesario
  });
  const [selectedArea, setSelectedArea] = useState(null);
  const [areas, setAreas] = useState([]);
  const [nuevaMateria, setNuevaMateria] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = (area) => {
    setIsOpen(true);
    setSelectedArea(area);
  };

  const closeModal1 = () => {
    setIsOpen1(false);
  };

  const openModal1 = (materia) => {
    setIsOpen1(true);
    setSelectedMateria(materia);
  };

  //PARA CARGAR DESDE UN INICIO LAS MATERIAS EN SU RESPECTIVAS AREAS
  useEffect(() => {
    fetchAreasConMaterias();
  }, []);

  //METODO PARA TRAER LAS AREAS CON MATERIAS
  const fetchAreasConMaterias = async () => {
    try {
      const response = await materiasServicio.getAreasyMaterias(); //SE USA EL SERVICIO PARA TRAER DE LA BD
      if (response.data) {
        setAreas(response.data); // ESTABLECE LAS AREAS
      } else {
        console.error('NO SE ENCONTRARON ÁREAS CON MATERIAS');
      }
    } catch (error) {
      console.error('ERROR AL ACCEDER A ENCONTRAR MATERIAS CON ÁREAS:', error);
    }
  };

  //METODO PARA AÑADIR MATERIAS A UNA ÁREA
  const handleAddMateria = async () => {
    if (nuevaMateria.trim() === '') return;
    try {
      const nuevaMateriaObj = {
        nombre: nuevaMateria,
        area: {
          id: selectedArea.id
        }
      };
      const response = await materiasServicio.addMateria(nuevaMateriaObj);
      if (response.data) {
        const updatedAreas = areas.map(area => {
          if (area.id === selectedArea.id) {
            return {
              ...area,
              materias: [...area.materias, response.data]
            };
          }
          return area;
        });

        setAreas(updatedAreas);
        setNuevaMateria('');
        setIsOpen(false);
      } else {
        console.error('No se pudo agregar la materia');
      }
    } catch (error) {
      console.error('Error al agregar la materia:', error);
    }
  };

  //MÉTODO PARA ELIMINAR MATERIA
  const handleDeleteMateria = async (materiaId) => {
    try {
      const response = await materiasServicio.deleteMateria(materiaId);
  
      if (response.data) {
        fetchAreasConMaterias(); // Vuelve a cargar los datos
        setIsOpen1(false);
      } else {
        console.error('No se pudo eliminar la materia');
      }
    } catch (error) {
      console.error('Error al eliminar la materia:', error);
    }
  };

  //MÉTODO PARA ACTUALIZAR MATERIA
  const handleUpdateMateria = async () => {
    try {
      const response = await materiasServicio.updateMateria(selectedMateria.id, selectedMateria);
      if (response.data) {
        // Actualiza el estado de las áreas o realiza otras acciones según tus necesidades
        console.log('Materia actualizada:', response.data);
        setIsOpen1(false); // Cierra el modal después de actualizar la materia
        // Vuelve a cargar los datos de la lista de materias
        fetchAreasConMaterias();
      } else {
        console.error('No se recibieron datos al actualizar la materia');
      }
    } catch (error) {
      console.error('Error al actualizar la materia:', error);
    }
  };

  return (
    <div className="mt-12 mb-8 flex flex-col gap-12">
      <Card>
        <CardHeader variant="gradient" color="gray" className="mb-8 p-6 text-center">
          <Typography variant="h6" color="white">
            Materias
          </Typography>
        </CardHeader>
        <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr>
                <th
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    Área
                  </Typography>
                </th>
                <th
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    Materias
                  </Typography>
                </th>
                <th
                  className="border-b border-blue-gray-50 py-3 px-5 text-left"
                >
                  <Typography
                    variant="small"
                    className="text-[11px] font-bold uppercase text-blue-gray-400"
                  >
                    Añadir Materias
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody >
              {areas.map((area, index) => {
                const className = `py-3 px-5 ${index === areas.length - 1 ? "" : "border-b border-blue-gray-50"}`;
                return (
                  <tr key={area.nombre}>
                    <td className={className}>
                      <div className="flex items-center gap-4">
                        <Typography variant="small" color="blue-gray" className="font-semibold">
                          {area.nombre}
                        </Typography>
                      </div>
                    </td>
                    <td className={className}>
                      <ul>
                        {area.materias.map((materia, idx) => (
                          <li key={idx} className="flex items-center">
                            <Typography className="text-xs font-normal text-blue-gray-500 w-1/2">
                              {materia.nombre}
                            </Typography>
                            <button
                              onClick={() => openModal1(materia)}
                              className="flex items-center space-x-1 font-medium text-blue-600 dark:text-blue-500 hover:underline"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                                />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className={className}>
                      <button
                        onClick={() => openModal(area)}
                        className="flex items-center space-x-1 font-medium text-green-600 dark:text-green-500 hover:underline"
                      >
                        <span>Añadir</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="size-6"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                );
              })}
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
                    Añadir Materia al Área de {selectedArea && selectedArea.nombre}
                  </DialogTitle>
                  <div className="mt-4">
                  </div>
                  <div className="mt-4">
                    <div className="mt-1">
                      <Input
                        color="gray"
                        label="Nombre de Materia"
                        type="text"
                        value={nuevaMateria}
                        onChange={(e) => setNuevaMateria(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-8 space-x-4">
                    <Button color="red" onClick={closeModal}>Cancelar</Button>
                    <Button color="green" onClick={handleAddMateria}>Guardar</Button>
                  </div>
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 p-1 rounded-lg text-gray-500 bg-transparent hover:bg-gray-50 hover:text-gray-600 w-7 fill-current"
                  >
                    <XMarkIcon />
                  </button>
                </div>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      </div>
      <div>
        <Transition appear show={isOpen1} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal1}>
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
                    Editar Materia
                  </DialogTitle>
                  <div className="mt-4">
                  </div>
                  <div className="mt-4">
                    <div className="mt-1">
                      <Input
                        color="gray"
                        label="Nombre de Materia"
                        type="text"
                        value={selectedMateria.nombre}
                        onChange={(e) => setSelectedMateria({ ...selectedMateria, nombre: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-8 space-x-4">
                    <Button color="red" onClick={() => handleDeleteMateria(selectedMateria.id)} >Eliminar Materia</Button>
                    <Button color="green" onClick={handleUpdateMateria}>Guardar</Button>
                  </div>
                  <button
                    onClick={closeModal1}
                    className="absolute top-2 right-2 p-1 rounded-lg text-gray-500 bg-transparent hover:bg-gray-50 hover:text-gray-600 w-7 fill-current"
                  >
                    <XMarkIcon />
                  </button>
                </div>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  )
}

export default Materias;