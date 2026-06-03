import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "@/app/ProtectedRoute";
import { PortalProtectedRoute } from "@/app/PortalProtectedRoute";
import { AppShell } from "@/shared/components/layout/AppShell";
import { PortalShell } from "@/shared/components/layout/PortalShell";
import { BillingPage } from "@/pages/BillingPage";
import { CustomersPage } from "@/pages/CustomersPage";
import { CustomerFormPage } from "@/pages/CustomerFormPage";
import { CustomerDetailPage } from "@/pages/CustomerDetailPage";
import { PaymentsPage } from "@/pages/PaymentsPage";
import { DashboardPage } from "@/pages/DashboardPage";
import { LandingPage } from "@/pages/LandingPage";
import { LoginPage } from "@/pages/LoginPage";
import { PackagesPage } from "@/pages/PackagesPage";
import { PortalBillsPage } from "@/pages/PortalBillsPage";
import { PortalDashboardPage } from "@/pages/PortalDashboardPage";
import { PortalLoginPage } from "@/pages/PortalLoginPage";
import { PortalTicketsPage } from "@/pages/PortalTicketsPage";
import { OltPage } from "@/pages/OltPage";
import { BandwidthLivePage } from "@/pages/BandwidthLivePage";
import { BandwidthReportsPage } from "@/pages/BandwidthReportsPage";
import { RoutersPage } from "@/pages/RoutersPage";
import { SchedulerPage } from "@/pages/SchedulerPage";
import { SmsPage } from "@/pages/SmsPage";
import { TicketsPage } from "@/pages/TicketsPage";
import { ZonesPage } from "@/pages/ZonesPage";
import { SettingsPage } from "@/pages/SettingsPage";

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/admin/login" element={<LoginPage />} />
        <Route path="/admin" element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<DashboardPage />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="customers/new" element={<CustomerFormPage />} />
            <Route path="customers/:customerId/edit" element={<CustomerFormPage />} />
            <Route path="customers/:customerId" element={<CustomerDetailPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="zones" element={<ZonesPage />} />
            <Route path="packages" element={<PackagesPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="sms" element={<SmsPage />} />
            <Route path="routers" element={<RoutersPage />} />
            <Route path="olt" element={<OltPage />} />
            <Route path="scheduler" element={<SchedulerPage />} />
            <Route path="tickets" element={<TicketsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="bandwidth/live" element={<BandwidthLivePage />} />
            <Route path="bandwidth/reports" element={<BandwidthReportsPage />} />
          </Route>
        </Route>

        <Route path="/portal/login" element={<PortalLoginPage />} />
        <Route path="/portal" element={<PortalProtectedRoute />}>
          <Route element={<PortalShell />}>
            <Route index element={<PortalDashboardPage />} />
            <Route path="bills" element={<PortalBillsPage />} />
            <Route path="tickets" element={<PortalTicketsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
