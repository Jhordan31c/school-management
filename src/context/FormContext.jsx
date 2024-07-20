import { createContext, useContext, useReducer } from "react";
import { FormReduces } from "@/reducers/FormReducers";

const initialFormData = {
    display: 0,
    data: {
        id_docente: "",
        id_grado: "",
        sub_grado: "",
        pago_mensual: null,
        pago_matricula: null,
        dia_vencimiento: null,
        alumnos: [],
        horarios: []
    } // Separate the actual form data
}

const FormContext = createContext(initialFormData);

export const FormContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(FormReduces, initialFormData);

    function addInfo(data) {
        dispatch({
            type: 'ADD_INFO',
            payload: data
        });
    }

    function goBack() {
        dispatch({
            type: 'GO_BACK'
        });
    }

    const value = {
        addInfo,
        goBack,
        data: state.data ,
        display: state.display,
        setDisplay: (display) => dispatch({ type: 'SET_DISPLAY', payload: display })
    }

    return (
        <FormContext.Provider value={value}>
            {children}
        </FormContext.Provider>
    );
}

export const useForm = () => useContext(FormContext);
