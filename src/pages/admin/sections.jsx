import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Avatar,
    Chip,
} from "@material-tailwind/react";
import { authorsTableData, projectsTableData } from "@/data";
import {SectionsTable } from "@/widgets/components";


export function Section() {
    return (
        <div className="mt-12 mb-8 flex flex-col gap-12">
            <SectionsTable />
        </div>
    )
}

export default Section;

