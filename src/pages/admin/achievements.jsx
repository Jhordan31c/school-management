import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Tooltip,
    Progress,
    Menu,
    MenuList,
    MenuHandler,
    IconButton,
    MenuItem
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { MembersTable, Modal } from "@/widgets/components";
import { authorsTableData, projectsTableData } from "@/data";
import { useState } from "react";


export function Achievements() {

    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <MembersTable />
        </div>
    )
}

export default Achievements;