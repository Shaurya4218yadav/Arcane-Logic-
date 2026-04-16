"use client";

import React from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell 
} from "recharts";
import { Shield, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";

const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b"];

export default function AdminMetricsComponent({ metrics }: { metrics: any }) {
  const data = [
    { name: "Mon", claims: 4000, premiums: 2400 },
    { name: "Tue", claims: 3000, premiums: 1398 },
    { name: "Wed", claims: 2000, premiums: 9800 },
    { name: "Thu", claims: 2780, premiums: 3908 },
    { name: "Fri", claims: 1890, premiums: 4800 },
    { name: "Sat", claims: 2390, premiums: 3800 },
    { name: "Sun", claims: 3490, premiums: 4300 },
  ];

  const pieData = [
    { name: "Legit", value: 100 - (metrics.fraud_rate * 100) },
    { name: "Fraud", value: metrics.fraud_rate * 100 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Loss Ratio" 
          value={`${(metrics.loss_ratio * 100).toFixed(1)}%`} 
          icon={<TrendingUp className="text-blue-400" />}
          trend="-2.4%"
          trendUp={false}
        />
        <MetricCard 
          title="Fraud Rate" 
          value={`${(metrics.fraud_rate * 100).toFixed(1)}%`} 
          icon={<AlertTriangle className="text-red-400" />}
          trend="+0.1%"
          trendUp={true}
        />
        <MetricCard 
          title="Premiums Collected" 
          value={`₹${metrics.total_premiums_collected.toLocaleString()}`} 
          icon={<DollarSign className="text-green-400" />}
        />
        <MetricCard 
          title="Recent Anomalies" 
          value={metrics.recent_anomalies} 
          icon={<Shield className="text-purple-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Claims vs Premiums (Weekly)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", color: "#f1f5f9" }}
                />
                <Bar dataKey="premiums" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="claims" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-lg font-medium text-slate-200 mb-4">Integrity Overview</h3>
          <div className="flex flex-col md:flex-row items-center justify-around h-64">
            <div className="w-full h-full md:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-sm text-slate-400">Normal Claims ({pieData[0].value}%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-sm text-slate-400">Flagged Fraud ({pieData[1].value}%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, trend, trendUp }: any) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 p-5 rounded-2xl">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-slate-800/50 rounded-lg">
          {icon}
        </div>
        {trend && (
          <span className={`text-xs font-medium ${trendUp ? 'text-red-400' : 'text-green-400'}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-sm text-slate-400">{title}</p>
      <p className="text-2xl font-bold text-slate-100 mt-1">{value}</p>
    </div>
  );
}
