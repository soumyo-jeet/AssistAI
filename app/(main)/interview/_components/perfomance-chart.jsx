"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  ReferenceLine
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Circle } from "lucide-react";

export default function PerformanceChart({ assessments }) {
  const [chartData, setChartData] = useState([]);
  const [trendDirection, setTrendDirection] = useState('neutral');
  const [averageScore, setAverageScore] = useState(0);

  useEffect(() => {
    if (assessments?.length > 0) {
      const formattedData = assessments
        .map((assessment) => ({
          date: new Date(assessment.createdAt),
          rawDate: assessment.createdAt,
          score: assessment.quizScore,
        }))
        .sort((a, b) => a.date - b.date)
        .map((item) => ({
          ...item,
          date: format(item.date, "MMM dd"),
        }));

      setChartData(formattedData);

      const avg = formattedData.reduce((sum, item) => sum + item.score, 0) / formattedData.length;
      setAverageScore(Math.round(avg));

      if (formattedData.length >= 2) {
        const firstScore = formattedData[0].score;
        const lastScore = formattedData[formattedData.length - 1].score;
        setTrendDirection(lastScore > firstScore ? 'up' : lastScore < firstScore ? 'down' : 'neutral');
      }
    }
  }, [assessments]);

  const getTrendColor = () => {
    switch(trendDirection) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getTrendIcon = () => {
    switch(trendDirection) {
      case 'up': return <TrendingUp className="h-5 w-5 text-green-500" />;
      case 'down': return <TrendingDown className="h-5 w-5 text-red-500" />;
      default: return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl font-bold text-white-800">Performance Trend</CardTitle>
            <CardDescription className="text-gray-600">Your quiz scores over time</CardDescription>
          </div>
          {chartData.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Avg: {averageScore}%</span>
              <div className={`flex items-center ${getTrendColor()}`}>
                {getTrendIcon()}
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length > 0 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
              >
                {/* White grid background */}
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  vertical={false} 
                  stroke="rgba(255, 255, 255, 0.3)"
                  strokeWidth={2}
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <YAxis 
                  domain={[0, 100]} 
                  tick={{ fill: '#6b7280' }}
                  tickLine={{ stroke: '#e5e7eb' }}
                  axisLine={{ stroke: '#e5e7eb' }}
                />
                <ReferenceLine 
                  y={averageScore} 
                  stroke="#9ca3af" 
                  strokeDasharray="3 3" 
                  label={{
                    value: `Avg ${averageScore}%`,
                    position: 'insideRight',
                    fill: '#6b7280',
                    fontSize: 12
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
                          <p className="font-medium text-gray-900">
                            <span className="text-blue-600">{payload[0].value}%</span>
                          </p>
                          <p className="text-sm text-gray-600">
                            {payload[0].payload.date}
                          </p>
                          {payload[0].payload.rawDate && (
                            <p className="text-xs text-gray-500 mt-1">
                              {format(new Date(payload[0].payload.rawDate), "PPp")}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                {/* White curve line with glow effect */}
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="white"
                  strokeWidth={4}
                  dot={{
                    fill: "white",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    r: 5
                  }}
                  activeDot={{
                    fill: "white",
                    stroke: "#3b82f6",
                    strokeWidth: 2,
                    r: 7
                  }}
                />
                {/* Blue fill area for better visibility */}
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                  strokeWidth={0}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">No assessment data available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}