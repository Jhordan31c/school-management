import { StatisticsCardModified } from "@/widgets/cards";
import { CreditCardIcon } from "@heroicons/react/24/solid";
import { useUser } from '@/context/UserContext';


export const PaymentsNoteCard = () => {
    const { user } = useUser();

    return (
        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
            {user.pagos.map((payment, index) => (
                <StatisticsCardModified
                    key={index}
                    icon={<CreditCardIcon className="w-10 h-10 text-white" />}
                    title={payment.nombre}
                    color={payment.estado === 1 ? 'bg-green-500' : payment.estado === 2 ? 'bg-yellow-500' : payment.estado === 0 ? 'bg-orange-800' : 'bg-gray-300'}
                    value={payment.monto}
                    role={user.roles[0]}
                    date={payment.fecha_vencimiento.split('T')[0]}
                />
            ))}
        </div>
    );
};

export default PaymentsNoteCard;
