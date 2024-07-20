import React, { useState, Fragment } from "react";
import { StatisticsCardModified } from "@/widgets/cards";
import { Typography, Tooltip, IconButton, Input, Button, Select, Option } from "@material-tailwind/react";
import { StatisticsChart } from "@/widgets/charts";
import { useEffect } from "react";
import { CommandPalette } from "@/widgets/components";
import { statisticsChartsDataPay } from "@/data";
import { Transition, TransitionChild, Dialog, DialogTitle } from "@headlessui/react";
import { ClockIcon, CreditCardIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/solid";
import pagosServicios from '@/services/pagosService';
import { useUser } from "@/context/UserContext";


export function Payment() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [detailedPayments, setDetailedPayments] = useState([]);
  const [paramPagos, setParamPagos] = useState([
    { id: 1, precioMatricula: 0, precioPension: 0, nivel: 1, dia_vencimiento: 0, mora: 0 },
    { id: 2, precioMatricula: 0, precioPension: 0, nivel: 2, dia_vencimiento: 0, mora: 0 },
    { id: 3, precioMatricula: 0, precioPension: 0, nivel: 3, dia_vencimiento: 0, mora: 0 },
  ]);
  const { user } = useUser();


  useEffect(() => {
    pagosServicios.getApodPagos()
      .then(response => {
        setStudents(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the students!", error);
      });
  }, []);

  useEffect(() => {
    if (selectedStudent) {
      pagosServicios.getApodPagosById(selectedStudent.id)
        .then(response => {
          setDetailedPayments(response.data);
        })
        .catch(error => {
          console.error("There was an error fetching the detailed payments!", error);
        });
    }
  }, [selectedStudent]);

  useEffect(() => {
    pagosServicios.getParamPagos()
      .then(response => {
        setParamPagos(response.data);
      })
      .catch(error => {
        console.error("There was an error fetching the paramPagos!", error);
      });
  }, []);


  const handleChange = (e, index, field) => {
    const newParamPagos = [...paramPagos];
    newParamPagos[index][field] = e.target.value;

    // Recalcular precioPension si la mora o diaVencimiento ha cambiado
    if (field === 'mora' || field === 'dia_vencimiento') {
      const moraValue = parseFloat(newParamPagos[index].mora) || 0;
      const diaVencimiento = newParamPagos[index].dia_vencimiento;
      const precioPensionOriginal = newParamPagos[index].precioPensionOriginal || newParamPagos[index].precioPension;

      const moraCalculated = calculateMora(diaVencimiento, moraValue);
      newParamPagos[index].precioPension = precioPensionOriginal + moraCalculated;
    }

    setParamPagos(newParamPagos);
  };

  const calculateMora = (diaVencimiento, mora) => {
    const today = new Date();
    const dueDate = new Date(today.getFullYear(), today.getMonth(), diaVencimiento);

    if (today > dueDate) {
      const daysLate = Math.floor((today - dueDate) / (1000 * 60 * 60 * 24));
      return mora * daysLate;
    }
    return 0;
  };


  const handleSave = async () => {
    try {
      const updatedParamPagos = paramPagos.map(paramPago => {
        const moraValue = parseFloat(paramPago.mora) || 0;
        const moraCalculated = calculateMora(paramPago.dia_vencimiento, moraValue);
        return { ...paramPago, mora: moraValue, precioPension: paramPago.precioPension + moraCalculated };
      });
      await pagosServicios.setParamPagos(updatedParamPagos);
      closeModal();
    } catch (error) {
      console.error('Error setting paramPagos:', error);
    }
  };


  const closeModal = () => {
    setIsOpen2(false);
  }

  return (
    <>
      <div className="text-center">
        <Typography variant="h4" className="font-bold">
          Gestión De Pagos
        </Typography>
      </div>
      <div className="mt-12">
        <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
          {statisticsChartsDataPay.map((props) => (
            <StatisticsChart
              key={props.title}
              {...props}
              footer={
                <Typography
                  variant="small"
                  className="flex items-center font-normal text-blue-gray-600"
                >
                  <ClockIcon strokeWidth={2} className="h-4 w-4 text-blue-gray-400" />
                  &nbsp;{props.footer}
                </Typography>
              }
            />
          ))}
        </div>
        <div className="absolute right-7">
          <Tooltip content="Establecer pagos">
            <IconButton variant="text" onClick={() => setIsOpen2(true)} className="rounded-full">
              <PlusIcon className="h-5 w-5" />
            </IconButton>
          </Tooltip>
        </div>
        <CommandPalette payments={students} onSelect={setSelectedStudent} isOpen={isOpen} setIsOpen={setIsOpen} />
        {selectedStudent && (
          <>
            <div className="text-center mb-8">
              <Typography variant="h4" className="font-bold">
                Alumno: {selectedStudent.nombre} {selectedStudent.apellido}
              </Typography>
            </div>
            <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
              {detailedPayments.map((payment, index) => (
                <StatisticsCardModified
                  key={index}
                  icon={<CreditCardIcon className="w-10 h-10 text-white" />}
                  title={payment.nombre}
                  color={payment.estado === 1 ? 'bg-green-500' : payment.estado === 2 ? 'bg-yellow-500' : payment.estado === 0 ? 'bg-orange-800' : 'bg-gray-300'}
                  value={payment.monto}
                  img={payment.detalle}
                  role={user.roles[0]}
                  date={payment.fecha_vencimiento.split('T')[0]}
                />
              ))}
            </div>
          </>
        )}
        {!selectedStudent && !isOpen && (
          <>
            <div className="text-center mb-12 mt-16">
              <Typography variant="h4" className="text-gray-500 text-sm">
                Presione <div className="inline-block bg-gray-200 text-gray-900 font-mono font-semibold px-3 py-1 border border-gray-400 rounded-md shadow-sm">
                  <kbd>Ctrl</kbd>
                </div> + <div className="inline-block bg-gray-200 text-gray-900 font-mono font-semibold px-3 py-1 border border-gray-400 rounded-md shadow-sm">
                  <kbd>B</kbd>
                </div>
              </Typography>
            </div>
          </>
        )}
      </div>
      <div>
        <Transition appear show={isOpen2} as={Fragment}>
          <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
            <div className="min-h-screen px-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
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
                <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <DialogTitle as="h3" className="text-lg font-medium leading-6 text-gray-900 text-center">
                    Modificar Pagos
                  </DialogTitle>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {paramPagos.map((paramPago, index) => (
                      <div key={paramPago.id}>
                        <div className="relative mt-10">
                          <span className="absolute inset-0 flex items-center" aria-hidden="true">
                            <span className="w-full border-t border-gray-300" />
                          </span>
                          <span className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">
                              {paramPago.nivel === 1 ? 'Inicial' : paramPago.nivel === 2 ? 'Primaria' : 'Secundaria'}
                            </span>
                          </span>
                        </div>
                        <div className="mt-5">
                          <Input
                            color="gray"
                            label="Pago Matricula"
                            value={paramPago.precioMatricula}
                            onChange={(e) => handleChange(e, index, 'precioMatricula')}
                          />
                        </div>
                        <div className="mt-5">
                          <Input
                            color="gray"
                            label="Pago mensual"
                            value={paramPago.precioPension}
                            onChange={(e) => handleChange(e, index, 'precioPension')}
                          />
                        </div>
                        <div className="mt-5">
                          <Input
                            color="gray"
                            label="Dia de Vencimiento"
                            value={paramPago.dia_vencimiento}
                            onChange={(e) => handleChange(e, index, 'dia_vencimiento')}
                          />
                        </div>
                        <div className="mt-5 relative">
                          <Input
                            color="gray"
                            label="Mora"
                            value={paramPago.mora || ''} // Aquí puedes manejar este valor de manera similar
                            onChange={(e) => handleChange(e, index, 'mora')} // Aquí puedes manejar el cambio de este valor
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center mt-10 gap-5">
                    <Button color="red" onClick={closeModal}>Cancelar</Button>
                    <Button color="green" onClick={handleSave}>Guardar</Button>
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
    </>
  );
}
export default Payment;
