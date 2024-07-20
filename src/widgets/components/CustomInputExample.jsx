import { useState } from "react";
import { Dialog, Transition, DialogPanel, DialogTitle, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";
import { EyeIcon, XMarkIcon, CloudArrowUpIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";

const CustomInputExample = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [imageURL, setImageURL] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImageURL(URL.createObjectURL(file));
        }
    };

    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);

    return (
        <form>
            <div className="flex flex-row items-center mt-2">
                <input
                    type="file"
                    id="custom-input"
                    onChange={handleFileChange}
                    hidden
                />
                <label
                    htmlFor="custom-input"
                    className="block text-sm text-slate-500 mr-4 py-2 px-4
                    rounded-md border-0 text-sm font-semibold bg-pink-50
                    text-pink-700 hover:bg-pink-100 cursor-pointer"
                >
                    <ArrowUpTrayIcon className="w-5 h-5" />
                </label>
                {selectedFile && (
                    <>
                        <button
                            type="button"
                            onClick={openModal}
                            className="text-sm text-slate-500 ml-4 py-2 px-4
                        rounded-md border-0 text-sm font-semibold bg-blue-50
                        text-blue-700 hover:bg-blue-100 cursor-pointer flex items-center"
                        >
                            <EyeIcon className="w-5 h-5" />
                        </button>
                        <button
                            type="submit"
                            className="text-sm text-slate-500 ml-4 py-2 px-4
                            rounded-md border-0 text-sm font-semibold bg-green-50
                            text-green-700 hover:bg-green-100 cursor-pointer flex items-center"
                            disabled={isUploading}
                        >
                            <CloudArrowUpIcon className="w-5 h-5" />
                            {isUploading ? 'Cargando...' : ''}
                        </button>
                    </>
                )}
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={closeModal}>
                    <TransitionChild
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </TransitionChild>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex items-center justify-center min-h-full p-4 text-center">
                            <TransitionChild
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <DialogPanel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                                    <DialogTitle
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-gray-900 text-center"
                                    >
                                        Imagen Seleccionada
                                    </DialogTitle>
                                    <div className="mt-4">
                                        <img src={imageURL} alt="Selected" className="w-full h-auto rounded-lg" />
                                    </div>
                                    <div className="mt-4">
                                        <button
                                            onClick={closeModal}
                                            className="absolute top-1 right-1 p-1 rounded-lg text-gray-500 bg-transparent hover:bg-gray-50 hover:text-gray-600 w-7 fill-current"
                                        >
                                            <XMarkIcon />
                                        </button>
                                    </div>
                                </DialogPanel>
                            </TransitionChild>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </form>
    );
};

export default CustomInputExample;
