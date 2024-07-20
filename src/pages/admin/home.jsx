import React, {useEffect, useState} from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Avatar,
  Tooltip,
  Progress,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  UserIcon, EnvelopeIcon
} from "@heroicons/react/24/outline";
import { StatisticsCard } from "@/widgets/cards";
import { StatisticsChart } from "@/widgets/charts";
import {
  useStatisticsData, getStatisticsCardsData, statisticsChartsData
} from "@/data";
import { CheckCircleIcon, ClockIcon } from "@heroicons/react/24/solid";
import { ChartsExample, AllCharts } from "@/widgets/components";
import citaServicio from '@/services/citaServicio';
import { useUser } from "@/context/UserContext";



const { DonutChart, DonutChart2 } = AllCharts;

export function Home() {

  const [citas, setCitas] = useState([]);
  const { user } = useUser();
  const { studentsCount, educatorsCount } = useStatisticsData();
  const statisticsCardsData = getStatisticsCardsData(studentsCount, educatorsCount);


  console.log(user)

  useEffect(() => {
    citaServicio.getCitasActivate().then((response) => {
      setCitas(response.data);
    }).catch((error) => {
      console.error("Error fetching citas: ", error);
    });
  }, []);


  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 grid-cols-2">
        {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
          <StatisticsCard
            key={title}
            {...rest}
            title={title}
            icon={React.createElement(icon, {
              className: "w-6 h-6 text-white",
            })}
            footer={
              <Typography className="font-normal text-blue-gray-600">
                <strong className={footer.color}>{footer.value}</strong>
                &nbsp;{footer.label}
              </Typography>
            }
          />
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-2">
        {statisticsChartsData.map((props) => (
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
      <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 grid gap-6">
          <Card className="border border-blue-gray-100 shadow-sm row-span-1">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="m-0 p-6"
            >
              <Typography variant="h6" color="blue-gray" className="-mb-10 text-center">
                Pagos Mensuales
              </Typography>
            </CardHeader>
            {/* Card grande */}
            <ChartsExample />
          </Card>
          <div className="grid grid-cols-2 gap-6 row-span-1">
            <Card className="border border-blue-gray-100 shadow-sm">
              <DonutChart />
            </Card>
            <Card className="border border-blue-gray-100 shadow-sm">
              {/* Contenido del mini-card 2 */}
              <DonutChart2 />
            </Card>
          </div>
        </div>
        {/* Citas Programadas */}
        <Card className="border border-blue-gray-100 shadow-sm">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="m-0 p-6"
          >
            <Typography variant="h6" color="blue-gray" className="mb-0">
              Citas programadas
            </Typography>
          </CardHeader>
          <CardBody className="pt-0 overflow-y-auto" style={{ maxHeight: '500px' }}>
            {citas.map(({ id, titulo, detalle }, key) => (
              <div key={id} className="flex items-start gap-4 py-3">
                <div
                  className={`relative p-1 after:absolute after:-bottom-6 after:left-2/4 after:w-0.5 after:-translate-x-2/4 after:bg-blue-gray-50 after:content-[''] ${key === citas.length - 1
                    ? "after:h-0"
                    : "after:h-4/6"
                    }`}
                >
                  <EnvelopeIcon className="!w-5 !h-5 text-blue-gray-300" />
                </div>
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="block font-medium"
                  >
                    {titulo}
                  </Typography>
                  <Typography
                    as="span"
                    variant="small"
                    className="text-xs font-medium text-blue-gray-300"
                  >
                    {detalle}
                  </Typography>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default Home;
