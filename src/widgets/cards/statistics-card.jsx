import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Menu,
  MenuHandler,
  MenuItem,
  MenuList,
  IconButton,
} from "@material-tailwind/react";
import {
  EllipsisVerticalIcon,
  ArrowUpIcon,
  ArrowUpOnSquareStackIcon
} from "@heroicons/react/24/outline";
import { ButtonOpenModal } from "@/widgets/components";
import { CustomInputExample } from "@/widgets/components";
import PropTypes from "prop-types";
import { useState } from "react";


export function StatisticsCard({ color = "blue", icon, title, value, footer = null, }) {
  return (
    <Card className="border border-blue-gray-100 shadow-sm">
      <CardHeader
        variant="gradient"
        color={color}
        floated={false}
        shadow={false}
        className="absolute grid h-12 w-12 place-items-center"
      >
        {icon}
      </CardHeader>
      <CardBody className="p-4 text-right">
        <Typography variant="small" className="font-normal text-blue-gray-600">
          {title}
        </Typography>
        <Typography variant="h4" color="blue-gray">
          {value}
        </Typography>
      </CardBody>
      {footer && (
        <CardFooter className="border-t border-blue-gray-50 p-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}

export const StatisticsCardModified = ({ icon, title, color, value, img, date, role }) => {

  return (
    <>
      <div className="relative bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <Typography variant="h5" className="mt-4 font-bold">
          {title}
        </Typography>
        <Typography variant="h8" className="mt-4">
          Monto: {value}
        </Typography>
        <Typography variant="h8" color="blue-gray">
          Fecha Vencimiento: {date}
        </Typography>
        {role === "ROLE_ADMIN" ? (
          <ButtonOpenModal img={img} />
        ) : role === "ROLE_ALUMNO" ? (
          <CustomInputExample />
        ) : null}
      </div>
    </>
  );
};

StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

const AllFunctions = { StatisticsCard, StatisticsCardModified };

export default AllFunctions;
