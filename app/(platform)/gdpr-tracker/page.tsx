"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Scale, TrendingUp, AlertCircle } from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell
} from "recharts";

const gdprFines = [
  {
    id: 1,
    company: "Meta Platforms Ireland",
    country: "Ireland",
    date: "2023-05-22",
    amount: 1200000000,
    violation: "Data transfer violations, lack of legal basis",
    authority: "Irish DPC"
  },
  {
    id: 2,
    company: "Amazon Europe Core",
    country: "Luxembourg",
    date: "2021-07-30",
    amount: 746000000,
    violation: "Processing personal data without proper legal basis",
    authority: "Luxembourg CNPD"
  },
  {
    id: 3,
    company: "WhatsApp Ireland",
    country: "Ireland",
    date: "2021-09-02",
    amount: 225000000,
    violation: "Transparency violations, lack of clear information",
    authority: "Irish DPC"
  },
  {
    id: 4,
    company: "Google Ireland",
    country: "Ireland",
    date: "2023-01-04",
    amount: 90000000,
    violation: "Lack of transparency, insufficient legal basis",
    authority: "Irish DPC"
  },
  {
    id: 5,
    company: "Instagram (Meta)",
    country: "Ireland",
    date: "2022-09-05",
    amount: 405000000,
    violation: "Children's data processing violations",
    authority: "Irish DPC"
  },
  {
    id: 6,
    company: "TikTok",
    country: "Ireland",
    date: "2023-09-15",
    amount: 345000000,
    violation: "Children's privacy, data transfers to China",
    authority: "Irish DPC"
  },
  {
    id: 7,
    company: "British Airways",
    country: "UK",
    date: "2020-10-16",
    amount: 22500000,
    violation: "Data breach affecting 400,000+ customers",
    authority: "UK ICO"
  },
  {
    id: 8,
    company: "H&M",
    country: "Germany",
    date: "2020-10-01",
    amount: 35300000,
    violation: "Excessive employee monitoring",
    authority: "Hamburg DPA"
  }
];

const finesByYear = [
  { year: "2020", amount: 171, count: 124 },
  { year: "2021", amount: 1089, count: 158 },
  { year: "2022", amount: 672, count: 189 },
  { year: "2023", amount: 2156, count: 201 },
];

export default function GDPRTrackerPage() {
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000000) {
      return `€${(amount / 1000000000).toFixed(2)}B`;
    } else if (amount >= 1000000) {
      return `€${(amount / 1000000).toFixed(0)}M`;
    }
    return `€${amount.toLocaleString()}`;
  };

  const totalFines = gdprFines.reduce((sum, fine) => sum + fine.amount, 0);
  const avgFine = totalFines / gdprFines.length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">GDPR Tracker</h1>
        <p className="text-slate-500 mt-1">Global data protection fine monitoring and compliance trends</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Fines (Top 8)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-red-600">
                {formatCurrency(totalFines)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Combined penalties since 2020</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Average Fine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {formatCurrency(avgFine)}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2">Mean enforcement value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Largest Fine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">€1.2B</span>
              <Badge variant="destructive" className="text-xs">Meta 2023</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-2">Record-breaking penalty</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            GDPR Fines by Year
          </CardTitle>
          <CardDescription>Total fine amounts (€M) and enforcement count</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={finesByYear}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="year" stroke="#64748b" style={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" style={{ fontSize: 12 }} label={{ value: "€ Millions", angle: -90, position: "insideLeft" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "6px",
                }}
                formatter={(value: any, name: string) => {
                  if (name === "amount") return [`€${value}M`, "Total Fines"];
                  return [value, "Enforcement Count"];
                }}
              />
              <Bar dataKey="amount" radius={[8, 8, 0, 0]}>
                {finesByYear.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === finesByYear.length - 1 ? "#ef4444" : "#3b82f6"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Fines Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-purple-600" />
            Notable GDPR Enforcement Actions
          </CardTitle>
          <CardDescription>Largest fines issued by EU data protection authorities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {gdprFines.map((fine) => (
              <div
                key={fine.id}
                className="flex items-start justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900">{fine.company}</h4>
                      <p className="text-sm text-slate-600 mt-1">{fine.violation}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span>{fine.authority}</span>
                        <span>•</span>
                        <span>{fine.country}</span>
                        <span>•</span>
                        <span>{new Date(fine.date).toLocaleDateString("en-US", { 
                          year: "numeric", 
                          month: "short", 
                          day: "numeric" 
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  <div className="text-2xl font-bold text-red-600">
                    {formatCurrency(fine.amount)}
                  </div>
                  <Badge variant="destructive" className="mt-1 text-xs">
                    GDPR Violation
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Key Compliance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-blue-900">
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <p>
              <strong>Data Transfer Violations</strong> are the most expensive, with Meta's €1.2B fine 
              setting a record for cross-border data flow non-compliance.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <p>
              <strong>Ireland's DPC</strong> leads enforcement actions against tech giants, 
              issuing over €2B in fines collectively.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <p>
              <strong>Transparency Requirements</strong> remain a common violation area—organizations 
              must clearly communicate data processing activities.
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="font-bold">•</span>
            <p>
              <strong>Children's Data</strong> receives heightened scrutiny, with TikTok and Instagram 
              facing major penalties for child privacy violations.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

