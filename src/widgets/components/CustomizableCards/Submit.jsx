import { useForm } from "@/context/FormContext";
import { useState } from "react";
import { Header } from "@/widgets/components/Sections/Header";
import { Button, Input } from "@material-tailwind/react";
import { useNavigate } from 'react-router-dom';
import aulaService from "@/services/aulaService";

export const Submit = ({ handleNext, handlePrev, isFirstStep, isLastStep }) => {
    const { addInfo, data } = useForm();
    const navigate = useNavigate(); 

    const [pagoMatricula, setPagoMatricula] = useState(data.pago_matricula || '');
    const [pagoMensual, setPagoMensual] = useState(data.pago_mensual || '');
    const [diaVencimiento, setDiaVencimiento] = useState(data.dia_vencimiento || '');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newData = {
            ...data,
            pago_matricula: parseFloat(pagoMatricula),
            pago_mensual: parseFloat(pagoMensual),
            dia_vencimiento: parseInt(diaVencimiento)
        };
        console.log(newData);
        addInfo(newData);

        try {
            await aulaService.addAula(newData);
            navigate("/admin/home");
        } catch (error) {
            console.error("Error al añadir aula:", error);
        }
    };

    return (
        <div>
            <Header head="Finanzas" para="" />
            <main>
                <form onSubmit={handleSubmit} className="flex flex-col mt-8">
                    <div>
                        <Input
                            color="teal"
                            label="Pago de Matricula"
                            value={pagoMatricula}
                            onChange={(e) => setPagoMatricula(e.target.value)}
                        />
                    </div>
                    <div className="mt-5">
                        <Input
                            color="teal"
                            label="Pension Mensual"
                            value={pagoMensual}
                            onChange={(e) => setPagoMensual(e.target.value)}
                        />
                    </div>
                    <div className="mt-5">
                        <Input
                            color="teal"
                            label="Dia de Vencimiento"
                            value={diaVencimiento}
                            onChange={(e) => setDiaVencimiento(e.target.value)}
                        />
                    </div>
                    <div className="mt-16 flex justify-between">
                        <Button onClick={handlePrev} disabled={isFirstStep}>
                            Prev
                        </Button>
                        <Button type="submit">
                            Next
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
};

export default Submit;
