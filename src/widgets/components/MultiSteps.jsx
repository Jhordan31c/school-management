import { PersonalInfo, SelectPlan, Ads, Submit } from "@/widgets/components/CustomizableCards";
import { Stepper, Step, Typography } from "@material-tailwind/react";
import { useForm } from "@/context/FormContext";
import React, { useState, useEffect } from "react";

export default function MultiSteps() {
    const { data, display, setDisplay } = useForm();


    useEffect(() => {
        setDisplay(data.display || 0);
    }, []);

    const handlePrev = () => {
        console.log("Handle Prev", display);
        if (display > 0) {
            setDisplay(display - 1);
        }
    };

    const handleNext = () => {
        console.log("Handle Next", display);
        if (display < 2) { // Asegúrate de que no se incremente más allá del paso 3
            setDisplay(display + 1);
        }
    };

    return (
        <section className="bg-white p-6 flex flex-col lg:flex-row rounded-[2.5%]">
            <div className="w-full lg:w-2/6 lg:block relative">
                <div className="h-[650px] w-full">
                    <img
                        src="/img/oppi.jpeg"
                        className="h-full w-full object-cover rounded-3xl"
                        alt="Pattern"
                    />
                </div>
            </div>

            <div className='w-full lg:w-[75%] pl-[15%] pr-[5%] pt-[5%]'>
                <div className="w-full py-4 px-8">
                    <Stepper activeStep={display}>
                        <Step onClick={() => setDisplay(0)}>1</Step>
                        <Step onClick={() => setDisplay(1)}>2</Step>
                        <Step onClick={() => setDisplay(2)}>3</Step>
                    </Stepper>
                    <div className="mt-8">
                        {display === 0 && <PersonalInfo handleNext={handleNext} handlePrev={handlePrev} isFirstStep={display === 0} isLastStep={display === 2} />}
                        {display === 1 && <SelectPlan handleNext={handleNext} handlePrev={handlePrev} isFirstStep={display === 0} isLastStep={display === 2} />}
                        {display === 2 && <Ads handleNext={handleNext} handlePrev={handlePrev} isFirstStep={display === 0} isLastStep={display === 2} />}
                        {display === 3 && (
                            <div>
                                <Typography variant="h4">Gracias</Typography>
                                <Typography>Has completado todos los pasos.</Typography>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
