import { Routes, Route, Navigate} from "react-router-dom";
import { Dashboard, Auth, DashParents, DashEducator } from "@/layouts";
import RoleProtectedRoute from "@/RoleProtectedRole";

function App() {
    return (
        <Routes>
            <Route path="/auth/*" element={<Auth />} />
            <Route element={<RoleProtectedRoute allowedRoles={['ROLE_ADMIN']} />}>
                <Route path="/admin/*" element={<Dashboard />} />
            </Route>
            <Route element={<RoleProtectedRoute allowedRoles={['ROLE_DOCENTE']} />}>
                <Route path="/educator/*" element={<DashEducator />} />
            </Route>
            <Route element={<RoleProtectedRoute allowedRoles={['ROLE_ALUMNO']} />}>
                <Route path="/parent/*" element={<DashParents />} />
            </Route>
            <Route path="*" element={<Navigate to="/auth/LoginApp" replace />} />
        </Routes>
    );
}

export default App;