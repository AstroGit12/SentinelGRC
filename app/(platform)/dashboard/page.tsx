"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRiskStore } from "@/store/risk-store";
import { useVendorStore } from "@/store/vendor-store";
import { useISOStore } from "@/store/iso-store";
import { 
  AlertTriangle, 
  Building2, 
  Shield, 
  TrendingUp,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  RadialBarChart,
  RadialBar,
  Legend,
  Cell,
  ScatterChart,
  Scatter,
  ZAxis
} from "recharts";
import { getRiskLevel } from "@/lib/utils";

export default function DashboardPage() {
  const { risks } = useRiskStore();
  const { vendors } = useVendorStore();
  const { controls } = useISOStore();

  // Calculate metrics
  const criticalRisks = risks.filter(r => getRiskLevel(r.inherentScore) === "critical").length;
  const highRisks = risks.filter(r => getRiskLevel(r.inherentScore) === "high").length;
  const openRisks = risks.filter(r => r.status === "Open").length;
  const pendingVendors = vendors.filter(v => v.complianceStatus === "Under Review").length;
  const implementedControls = controls.filter(c => c.implemented).length;
  const complianceScore = Math.round((implementedControls / controls.length) * 100);

  // Compliance velocity data (mock)
  const velocityData = [
    { month: "Jun", score: 65 },
    { month: "Jul", score: 70 },
    { month: "Aug", score: 73 },
    { month: "Sep", score: 78 },
    { month: "Oct", score: 82 },
    { month: "Nov", score: 87 },
  ];

  // Risk heatmap data
  const heatmapData = risks.map(risk => ({
    x: risk.inherentLikelihood,
    y: risk.inherentImpact,
    z: risk.inherentScore,
    name: risk.title
  }));

  const getScatterColor = (score: number) => {
    if (score >= 20) return "#ef4444";
    if (score >= 15) return "#f97316";
    if (score >= 8) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Command Center</h1>
        <p className="text-slate-500 mt-1">Real-time governance, risk, and compliance overview</p>
      </div>

      {/* KPI Cards - Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Compliance Score */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Compliance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{complianceScore}%</span>
              <Badge variant="success" className="text-xs">
                <TrendingUp className="h-3 w-3 mr-1" />
                +5%
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {implementedControls} of {controls.length} controls implemented
            </p>
          </CardContent>
        </Card>

        {/* Critical Risks */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Critical Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-600">{criticalRisks}</span>
              <Badge variant="destructive" className="text-xs">
                High Priority
              </Badge>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {highRisks} high-severity risks
            </p>
          </CardContent>
        </Card>

        {/* Open Risks */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Open Risks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{openRisks}</span>
              <AlertTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {risks.length - openRisks} mitigated or closed
            </p>
          </CardContent>
        </Card>

        {/* Pending Vendor Reviews */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Pending Vendor Reviews
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{pendingVendors}</span>
              <Building2 className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {vendors.length} total vendors tracked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compliance Velocity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Compliance Velocity
            </CardTitle>
            <CardDescription>6-month compliance score trend</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" style={{ fontSize: 12 }} />
                <YAxis stroke="#64748b" style={{ fontSize: 12 }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ fill: "#2563eb", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Heatmap */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Risk Distribution Matrix
            </CardTitle>
            <CardDescription>Likelihood vs Impact visualization</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Likelihood"
                  domain={[0, 6]}
                  stroke="#64748b"
                  style={{ fontSize: 12 }}
                  label={{ value: "Likelihood", position: "bottom", style: { fontSize: 12 } }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Impact"
                  domain={[0, 6]}
                  stroke="#64748b"
                  style={{ fontSize: 12 }}
                  label={{ value: "Impact", angle: -90, position: "left", style: { fontSize: 12 } }}
                />
                <ZAxis type="number" dataKey="z" range={[100, 400]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-3 border border-slate-200 rounded-lg shadow-lg">
                          <p className="font-semibold text-sm">{data.name}</p>
                          <p className="text-xs text-slate-600">Likelihood: {data.x}</p>
                          <p className="text-xs text-slate-600">Impact: {data.y}</p>
                          <p className="text-xs font-semibold mt-1">Score: {data.z}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={heatmapData}>
                  {heatmapData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getScatterColor(entry.z)} />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Risks */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Risk Activity</CardTitle>
            <CardDescription>Latest risks requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {risks.slice(0, 5).map((risk) => (
                <div
                  key={risk.id}
                  className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`h-2 w-2 rounded-full ${
                      getRiskLevel(risk.inherentScore) === "critical" ? "bg-red-500" :
                      getRiskLevel(risk.inherentScore) === "high" ? "bg-orange-500" :
                      getRiskLevel(risk.inherentScore) === "medium" ? "bg-amber-500" :
                      "bg-emerald-600"
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{risk.title}</p>
                      <p className="text-xs text-slate-500 font-mono">{risk.id} • {risk.category}</p>
                    </div>
                  </div>
                  <Badge
                    variant={risk.status === "Open" ? "destructive" : "success"}
                    className="text-xs"
                  >
                    {risk.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Current status overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-slate-600">ISO Controls</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {implementedControls}/{controls.length}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-slate-600">Compliant Vendors</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {vendors.filter(v => v.complianceStatus === "Compliant").length}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-slate-600">Non-Compliant</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {vendors.filter(v => v.complianceStatus === "Non-Compliant").length}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span className="text-sm text-slate-600">Under Review</span>
              </div>
              <span className="text-sm font-semibold text-slate-900">
                {pendingVendors}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

