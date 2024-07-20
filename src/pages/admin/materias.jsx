import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Avatar,
  Chip,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { authorsTableData, projectsTableData } from "@/data";
import React, { useState, useEffect } from "react";
import materiasServicio from '../../services/materiasServicio';



export function Materias() {

  const [showModal, setShowModal] = useState(false);
  const [showModalMaterias, setShowModalMaterias] = useState(false);
  const [selectedMateria, setSelectedMateria] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [areas, setAreas] = useState([]);
  const [nuevaMateria, setNuevaMateria] = useState('');

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
  //PARA CUANDO SE OPRIMA EL EDITAR DE LA TABLA
  const handleEditClick = (area) => {
    setSelectedArea(area);
    setShowModalMaterias(true);
  };

  //PARA CUANDO SE CLICKEA EL SVG DE EDITAR MATERIA
  const handleEditMateriaClick = (materia) => {
    setSelectedMateria(materia);
    setShowModal(true);
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
        setShowModalMaterias(false);
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

      // COMPROBACIÓN SI SE HACE LA ACCIÓN DE ELIMINAR
      if (response.data) {
        const updatedAreas = areas.map(area => {
          if (area.id === selectedArea.id) {
            const updatedMaterias = area.materias.filter(materia => materia.id !== materiaId);
            return {
              ...area,
              materias: updatedMaterias
            };
          }
          return area;
        });
        setAreas(updatedAreas);
        setShowModal(false);
      } else {
        console.error('No se pudo eliminar la materia');
      }
    } catch (error) {
      // Manejo de errores
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
        setShowModal(false); // Cierra el modal después de actualizar la materia

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
                              onClick={() => handleEditMateriaClick(materia)}
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
                        onClick={() => handleEditClick(area)}
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
      {showModalMaterias && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3 h-auto max-h-screen overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
              <h5 className="text-xl font-medium text-black">Añadir Materia al Área de {selectedArea && selectedArea.nombre}</h5>
              <button
                type="button"
                className="text-red-400 font-bold hover:bg-gray-300 rounded-lg px-2 py-2 shadow-md"
                onClick={() => setShowModalMaterias(false)}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <label className="block mb-2 font-bold text-black">NOMBRE DE LA MATERIA:</label>
              <input
                type="text"
                value={nuevaMateria}
                onChange={(e) => setNuevaMateria(e.target.value)}
                className=" mt-1 block w-full px-3 py-2 border border-purple-600 rounded-md bg-transparent text-black shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"

              />
            </div>
            <div className="px-4 py-3 border-t border-gray-700 flex justify-end space-x-2">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-500 z-1 border-2 border-blue-900"
                onClick={handleAddMateria}
              >
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-3/4 md:w-1/2 lg:w-1/3 h-auto max-h-screen overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-700 flex justify-between items-center">
              <h5 className="text-xl font-medium text-black">Editar Materia</h5>
              <button
                type="button"
                className="text-red-400 font-bold hover:bg-gray-300 rounded-lg px-2 py-2 shadow-md"
                onClick={() => setShowModal(false)}
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <div className="p-4">
              <label className="block mb-2 font-bold text-black">Actualizar nombre de la materia:</label>
              <input
                type="text"
                value={selectedMateria.nombre}
                onChange={(e) => setSelectedMateria({ ...selectedMateria, nombre: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-purple-600 rounded-md bg-transparent text-black shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <div className="px-4 py-3 border-t border-gray-700 flex justify-end space-x-2">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-all duration-500 z-1 border-2 border-blue-900"
                onClick={handleUpdateMateria}
              >
                <span>Guardar cambios</span>
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-all duration-500 z-1 border-2 border-red-900"
                onClick={() => handleDeleteMateria(selectedMateria.id)}
              >
                <span>Eliminar materia</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Materias;