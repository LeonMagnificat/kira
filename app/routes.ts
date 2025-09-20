import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";
import path from "path";

export default [
    // Admin routes at root-level paths (e.g., /dashboard)
    layout("routes/admin/admin-layout.tsx", [
        route("dashboard", "routes/admin/dashboard.tsx"),
        route("employees", "routes/admin/employees.tsx"),
        route("appointments", "routes/admin/appointments.tsx"),
        route("reports", "routes/admin/reports.tsx"),
        route("billing", "routes/admin/billing.tsx"),
        route("messages", "routes/admin/messages.tsx"),
        route("patients", "routes/admin/patients-admin.tsx"),
        route("notifications", "routes/admin/notifications.tsx"),
        route("settings", "routes/admin/settings.tsx"),
    ]),

    // Employee portal under /employee/*
    route(
        "employee",
        "routes/employee/employee-layout.tsx",
        [
            index("routes/employee/index.tsx"),
            route("home", "routes/employee/home.tsx"),
            route("messages", "routes/employee/messages.tsx"),
            route("patients", "routes/employee/patients.tsx"),
            route("monitoring", "routes/employee/monitoring.tsx"),
        ]
    ),
] satisfies RouteConfig;