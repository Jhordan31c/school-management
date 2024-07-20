import { useState } from "react";
import ToastContext from "./ToastService";
import { XMarkIcon } from "@heroicons/react/24/outline";


export default function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const open = (component, timeout = 5000) => {
        const id = Date.now();

        setToasts(toasts => [...toasts, { id, component }])

        setTimeout(() => close(id), timeout)
    }

    const close = (id) => {
        setToasts((toasts) => toasts.filter((toast) => toast.id !== id))
    }

    return (
        <ToastContext.Provider value={{ open, close }}>
            {children}
            <div className="space-y-2 absolute top-8 right-5">
                {toasts.map(({ id, component }) => (
                    <div key={id} className="relative">
                        <button onClick={() => close(id)} className="absolute top-2 right-2 p-1 rounded-lg bg-gray-200/20 text-gray-800/60">
                            <XMarkIcon className="w-5" />
                        </button>
                        {component}
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    )
}