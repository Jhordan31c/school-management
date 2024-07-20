import { ExclamationCircleIcon, EyeIcon } from "@heroicons/react/24/solid";
import { Modal, CustomizedSteppers } from "@/widgets/components";
import { Button } from "@material-tailwind/react";
import { useState } from "react";

export default function ButtonOpenModal({ img }) {

    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className="mt-4 px-4 py-2 bg-transparent text-black rounded-full flex items-center justify-center"
                onClick={() => setOpen(true)}
            >
                <EyeIcon className="w-5 h-5" />
            </button>
            <Modal open={open} onClose={() => setOpen(false)}>
                <div className="flex flex-col items-center text-center w-full max-w-md mx-auto p-4">
                    {img ? (
                        <>
                            <img src={img} alt="Preview" className="my-4 w-50 h-50 object-cover rounded-lg shadow-md border border-gray-300" />
                            <div className="w-full my-4">
                                <CustomizedSteppers />
                            </div>
                            <div className="flex gap-4 items-center mt-4">
                                <Button variant="outlined" className="focus:outline-none" color="indigo">
                                    Confirmar
                                </Button>
                            </div>
                        </>
                    ) : (
                        <div className="my-4 w-48 h-20 flex items-center justify-center bg-gray-100 rounded-lg shadow-md border border-gray-300">
                            <ExclamationCircleIcon className="w-5 h-5 text-gray-500" />
                            <span className="ml-2 text-gray-500">Image not found.</span>
                        </div>
                    )}
                </div>
            </Modal>

        </>
    )
}