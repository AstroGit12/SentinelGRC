"use client";

import { useISOStore } from "@/store/iso-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";

export default function ISOControlsPage() {
  const { controls, toggleImplemented } = useISOStore();
  const [filter, setFilter] = useState<"all" | "implemented" | "pending">("all");

  const categories = Array.from(new Set(controls.map(c => c.category)));
  
  const implementedCount = controls.filter(c => c.implemented).length;
  const completionPercentage = Math.round((implementedCount / controls.length) * 100);

  const filteredControls = controls.filter(control => {
    if (filter === "implemented") return control.implemented;
    if (filter === "pending") return !control.implemented;
    return true;
  });

  const groupedControls = categories.map(category => ({
    category,
    controls: filteredControls.filter(c => c.category === category)
  })).filter(g => g.controls.length > 0);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">ISO 27001 Controls</h1>
        <p className="text-slate-500 mt-1">Information Security Management System (ISMS) control framework</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Total Controls
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">{controls.length}</span>
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-xs text-slate-500 mt-2">ISO 27001:2022 Framework</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Implemented
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600">{implementedCount}</span>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="text-xs text-slate-500 mt-2">Active controls in place</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">
              Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-blue-600">{completionPercentage}%</span>
              <Badge variant="success" className="text-xs">On Track</Badge>
            </div>
            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Control Framework</CardTitle>
              <CardDescription>Click on a control to mark as implemented</CardDescription>
            </div>
            <Tabs value={filter} onValueChange={(value: any) => setFilter(value)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="implemented">Implemented</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {groupedControls.map(({ category, controls: categoryControls }) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  {category}
                  <Badge variant="outline" className="ml-2">
                    {categoryControls.filter(c => c.implemented).length}/{categoryControls.length}
                  </Badge>
                </h3>
                
                <Accordion type="single" collapsible className="space-y-2">
                  {categoryControls.map((control) => (
                    <AccordionItem
                      key={control.id}
                      value={control.id}
                      className="border border-slate-200 rounded-lg px-4 data-[state=open]:bg-slate-50"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <div className="flex items-center gap-3 text-left">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleImplemented(control.id);
                            }}
                            className="shrink-0"
                          >
                            {control.implemented ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-300" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-sm font-semibold text-slate-700">
                                {control.id}
                              </span>
                              <span className="font-medium text-slate-900">{control.title}</span>
                            </div>
                          </div>
                          {control.implemented && (
                            <Badge variant="success" className="text-xs">
                              Implemented
                            </Badge>
                          )}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="pt-2 pb-2 pl-8">
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {control.description}
                          </p>
                          <div className="mt-3 flex gap-2">
                            <Button
                              size="sm"
                              variant={control.implemented ? "outline" : "default"}
                              onClick={() => toggleImplemented(control.id)}
                            >
                              {control.implemented ? "Mark as Pending" : "Mark as Implemented"}
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

