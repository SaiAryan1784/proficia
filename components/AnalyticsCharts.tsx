"use strict";
"use client";

import React from 'react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

interface PerformanceData {
    date: string;
    score: number;
}

interface TopicData {
    topic: string;
    averageScore: number;
    testsCount: number;
}

interface AnalyticsChartsProps {
    performanceData: PerformanceData[];
    topicData: TopicData[];
}

export default function AnalyticsCharts({ performanceData }: AnalyticsChartsProps) {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!performanceData || performanceData.length === 0) return null;

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={performanceData}>
                <defs>
                    <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke={isDark ? "#374151" : "#E5E7EB"}
                />
                <XAxis
                    dataKey="date"
                    tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    stroke={isDark ? "#9CA3AF" : "#6B7280"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke={isDark ? "#9CA3AF" : "#6B7280"}
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={[0, 100]}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : 'white',
                        borderRadius: '8px',
                        border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`,
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                        color: isDark ? '#f9fafb' : '#111827'
                    }}
                    labelStyle={{ color: isDark ? '#9CA3AF' : '#6B7280' }}
                />
                <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    fillOpacity={1}
                    fill="url(#colorPerf)"
                    strokeWidth={2}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
