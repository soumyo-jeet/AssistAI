"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Briefcase,
  LineChart,
  TrendingUp,
  TrendingDown,
  BrainCircuit,
  Zap,
  AlertCircle,
  Clock,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const DashboardView = ({ insights }) => {
  // Loading state simulation (remove in production)
  const [isLoading, setIsLoading] = React.useState(false);
  
  // Enhanced data transformation with error handling
  const salaryData = React.useMemo(() => {
    if (!insights?.salaryRanges) return [];
    return insights.salaryRanges.map((range) => ({
      name: range.role.length > 15 ? `${range.role.substring(0, 15)}...` : range.role,
      min: range.min / 1000,
      max: range.max / 1000,
      median: range.median / 1000,
      avg: ((range.min + range.max) / 2) / 1000,
    }));
  }, [insights]);

  const getDemandLevelConfig = (level) => {
    const lvl = level?.toLowerCase() || 'medium';
    const configs = {
      high: { 
        color: "bg-emerald-500", 
        icon: <Zap className="h-4 w-4 text-emerald-500" />,
        label: "High Demand" 
      },
      medium: { 
        color: "bg-amber-500", 
        icon: <LineChart className="h-4 w-4 text-amber-500" />,
        label: "Moderate Demand" 
      },
      low: { 
        color: "bg-rose-500", 
        icon: <AlertCircle className="h-4 w-4 text-rose-500" />,
        label: "Low Demand" 
      }
    };
    return configs[lvl] || configs.medium;
  };

  const getMarketOutlookConfig = (outlook) => {
    const ol = outlook?.toLowerCase() || 'neutral';
    const configs = {
      positive: { 
        icon: <TrendingUp className="h-5 w-5 text-emerald-500" />,
        color: "text-emerald-500",
        label: "Positive Outlook",
        trendIcon: <ArrowUpRight className="h-4 w-4 text-emerald-500" />
      },
      neutral: { 
        icon: <LineChart className="h-5 w-5 text-amber-500" />,
        color: "text-amber-500",
        label: "Neutral Outlook",
        trendIcon: <LineChart className="h-4 w-4 text-amber-500" />
      },
      negative: { 
        icon: <TrendingDown className="h-5 w-5 text-rose-500" />,
        color: "text-rose-500",
        label: "Negative Outlook",
        trendIcon: <ArrowDownRight className="h-4 w-4 text-rose-500" />
      }
    };
    return configs[ol] || configs.neutral;
  };

  const demandConfig = getDemandLevelConfig(insights?.demandLevel);
  const outlookConfig = getMarketOutlookConfig(insights?.marketOutlook);

  // Format dates with error handling
  const formattedDates = React.useMemo(() => {
    try {
      return {
        lastUpdated: insights?.lastUpdated ? format(new Date(insights.lastUpdated), "PP") : "N/A",
        nextUpdate: insights?.nextUpdate ? formatDistanceToNow(new Date(insights.nextUpdate), { addSuffix: true }) : "Soon"
      };
    } catch {
      return { lastUpdated: "N/A", nextUpdate: "Soon" };
    }
  }, [insights]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 h-[60vh]">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h3 className="text-lg font-medium">No insights available</h3>
        <p className="text-muted-foreground text-sm">
          We couldn't load industry insights. Please try again later.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh and last updated */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
        <h1 className="font-bold text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Industry Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            Last updated: {formattedDates.lastUpdated}
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Clock className="h-3 w-3" />
          <span>Next update: {formattedDates.nextUpdate}</span>
        </Badge>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Market Outlook Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Market Outlook
            </CardTitle>
            {outlookConfig.icon}
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold capitalize">
                {insights.marketOutlook?.toLowerCase() || 'neutral'}
              </div>
              {outlookConfig.trendIcon}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {outlookConfig.label}
            </p>
          </CardContent>
        </Card>

        {/* Growth Rate Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Growth Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {insights.growthRate?.toFixed(1) || 0}%
            </div>
            <div className="mt-2">
              <Progress 
                value={insights.growthRate || 0} 
                indicatorcolor={
                  (insights.growthRate || 0) > 7 ? 'bg-emerald-500' : 
                  (insights.growthRate || 0) > 3 ? 'bg-amber-500' : 'bg-rose-500'
                }
              />
              <p className="text-xs text-muted-foreground mt-1">
                {(insights.growthRate || 0) > 7 ? 'Rapid growth' : 
                 (insights.growthRate || 0) > 3 ? 'Moderate growth' : 'Slow growth'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demand Level Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Demand Level</CardTitle>
            {demandConfig.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {insights.demandLevel?.toLowerCase() || 'medium'}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <div className={`h-2 w-full rounded-full ${demandConfig.color}`} />
              <p className="text-xs text-muted-foreground">
                {demandConfig.label}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Average Salary Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${salaryData[0]?.avg?.toFixed(1) || 0}K
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              For {salaryData[0]?.name || 'entry-level'} positions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Salary Ranges Chart */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Salary Ranges by Role</CardTitle>
              <CardDescription>
                Comparison of salary ranges (in thousands)
              </CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              <span>{salaryData.length} roles analyzed</span>
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salaryData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Salary (in thousands)', 
                    angle: -90, 
                    position: 'insideLeft',
                    fontSize: 12
                  }} 
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border rounded-lg p-4 shadow-lg">
                          <p className="font-bold mb-2">{label}</p>
                          <div className="grid grid-cols-2 gap-2">
                            {payload.map((item) => (
                              <div key={item.name} className="flex items-center gap-2">
                                <div 
                                  className="h-3 w-3 rounded-full" 
                                  style={{ backgroundColor: item.color }}
                                />
                                <span className="text-sm font-medium">
                                  {item.name}:
                                </span>
                                <span className="text-sm">
                                  ${item.value}K
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="min" 
                  name="Min Salary" 
                  fill="#94a3b8" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="median" 
                  name="Median Salary" 
                  fill="#64748b" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="max" 
                  name="Max Salary" 
                  fill="#475569" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Key Trends Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Key Industry Trends</span>
            </CardTitle>
            <CardDescription>
              Current developments shaping the {insights.industry} industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.keyTrends?.map((trend, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-2 w-2 mt-2 rounded-full bg-primary" />
                  <span className="text-sm leading-relaxed">{trend}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Skills Card */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-primary" />
              <span>Recommended Skills</span>
            </CardTitle>
            <CardDescription>
              Valuable skills to develop in this industry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {insights.recommendedSkills?.map((skill) => (
                <Badge 
                  key={skill} 
                  variant="outline" 
                  className="px-3 py-1 text-sm hover:bg-secondary/80 transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;