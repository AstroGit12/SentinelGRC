"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlayCircle, ChevronRight, User, LogOut, Settings } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth-store";
import { useRiskStore } from "@/store/risk-store";
import { useISOStore } from "@/store/iso-store";

const routeNames: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/risk-register": "Risk Register",
  "/vendor-risk": "Vendor Assessment",
  "/iso-controls": "ISO 27001 Controls",
  "/gdpr-tracker": "GDPR Tracker",
  "/cloud-simulator": "Cloud Simulator",
  "/incidents": "Incidents",
  "/profile": "Profile",
};

export function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const pageName = routeNames[pathname] || "SentinelGRC";
  const { user, logout } = useAuthStore();
  const { risks } = useRiskStore();
  const { controls } = useISOStore();

  const handleSimulateAudit = () => {
    const toastId = toast.loading("Running comprehensive compliance audit...");
    
    setTimeout(() => {
      // Dismiss the loading toast
      toast.dismiss(toastId);
      
      // Calculate actual scores from data
      const criticalRisks = risks.filter(r => r.inherentScore >= 20).length;
      const implementedControls = controls.filter(c => c.implemented).length;
      const complianceScore = Math.round((implementedControls / controls.length) * 100);
      
      const findings = [];
      if (criticalRisks > 0) findings.push(`${criticalRisks} critical risk${criticalRisks > 1 ? 's' : ''}`);
      if (complianceScore < 80) findings.push(`${Math.round(100 - complianceScore)}% controls pending`);
      if (findings.length === 0) findings.push("No issues found");
      
      const status = complianceScore >= 80 ? "success" : "warning";
      const message = complianceScore >= 80 
        ? `✅ Audit Complete! ${complianceScore}% compliance score`
        : `⚠️ Audit Complete - ${complianceScore}% compliance score`;
      
      toast[status](message, {
        description: findings.join(" • "),
        duration: 5000,
      });
    }, 2500);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-slate-500">SentinelGRC</span>
        <ChevronRight className="h-4 w-4 text-slate-400" />
        <span className="font-medium text-slate-900">{pageName}</span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handleSimulateAudit}
          className="gap-2"
          title="Run a simulated compliance audit across all modules"
        >
          <PlayCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Simulate Audit</span>
        </Button>

        {user && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-full">
                <Avatar className="cursor-pointer hover:ring-2 hover:ring-blue-600 transition-all">
                  <AvatarFallback className="bg-blue-600 text-white font-semibold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/profile")}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}

