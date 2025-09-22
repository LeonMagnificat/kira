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

    // Doctor portal under /doctor/*
    route(
        "doctor",
        "routes/doctor/doctor-layout.tsx",
        [
            index("routes/doctor/index.tsx"),
            route("patients", "routes/doctor/patients.tsx"),
            route("prescriptions", "routes/doctor/prescriptions.tsx"),
            route("visits", "routes/doctor/visits.tsx"),
            route("appointments", "routes/doctor/appointments.tsx"),
        ]
    ),

    // Nurse portal under /nurse/*
    route(
        "nurse",
        "routes/nurse/nurse-layout.tsx",
        [
            index("routes/nurse/index.tsx"),
            route("patients", "routes/nurse/patients.tsx"),
            route("vitals", "routes/nurse/vitals.tsx"),
            route("medication", "routes/nurse/medication.tsx"),
            route("schedule", "routes/nurse/schedule.tsx"),
        ]
    ),

    // Patient portal under /patient/*
    route(
        "patient",
        "routes/patient/patient-layout.tsx",
        [
            index("routes/patient/index.tsx"),
            route("history", "routes/patient/history.tsx"),
            route("prescriptions", "routes/patient/prescriptions.tsx"),
            route("appointments", "routes/patient/appointments.tsx"),
            route("messages", "routes/patient/messages.tsx"),
            route("documents", "routes/patient/documents.tsx"),
        ]
    ),
] satisfies RouteConfig;