import { BrainCircuit, Target, Trophy, TrendingUp, BarChart2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function StatsCards({ assessments }) {
  const getAverageScore = () => {
    if (!assessments?.length) return 0;
    const total = assessments.reduce(
      (sum, assessment) => sum + assessment.quizScore,
      0
    );
    return (total / assessments.length).toFixed(1);
  };

  const getLatestAssessment = () => {
    if (!assessments?.length) return null;
    return assessments[0];
  };

  const getTotalQuestions = () => {
    if (!assessments?.length) return 0;
    return assessments.reduce(
      (sum, assessment) => sum + assessment.questions.length,
      0
    );
  };

  const getScoreTrend = () => {
    if (!assessments?.length || assessments.length < 2) return 'neutral';
    const latest = assessments[0].quizScore;
    const previous = assessments[1].quizScore;
    return latest > previous ? 'up' : latest < previous ? 'down' : 'neutral';
  };

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'up': return 'text-green-500';
      case 'down': return 'text-red-500';
      default: return 'text-amber-500';
    }
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4" />;
      case 'down': return <TrendingUp className="h-4 w-4 transform rotate-180" />;
      default: return <BarChart2 className="h-4 w-4" />;
    }
  };

  const averageScore = parseFloat(getAverageScore());
  const latestScore = getLatestAssessment()?.quizScore || 0;
  const totalQuestions = getTotalQuestions();
  const trend = getScoreTrend();

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Average Score Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average Score
          </CardTitle>
          <div className="p-2 rounded-full bg-primary/10">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{averageScore}%</div>
          <div className="flex items-center gap-2 mt-3">
            <Progress value={averageScore} className="h-2" />
            <span className="text-xs text-muted-foreground">
              {assessments?.length || 0} assessments
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Questions Practiced Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Questions Practiced
          </CardTitle>
          <div className="p-2 rounded-full bg-blue-500/10">
            <BrainCircuit className="h-5 w-5 text-blue-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalQuestions}</div>
          <div className="flex items-center gap-2 mt-3">
            <div className="flex-1 bg-muted h-2 rounded-full overflow-hidden">
              <div 
                className="bg-blue-500 h-full" 
                style={{ width: `${Math.min(100, totalQuestions / 100 * 100)}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground">
              ~{Math.floor(totalQuestions / 10)} quizzes
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Latest Score Card */}
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Latest Score
          </CardTitle>
          <div className="flex items-center gap-1">
            <div className={`p-1 rounded-full ${getTrendColor(trend)}/10`}>
              {getTrendIcon(trend)}
            </div>
            <div className="p-2 rounded-full bg-emerald-500/10">
              <Target className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{latestScore.toFixed(1)}%</div>
          <div className="flex items-center gap-2 mt-3">
            <div className={`text-xs flex items-center ${getTrendColor(trend)}`}>
              {getTrendIcon(trend)}
              <span className="ml-1">
                {trend === 'up' ? 'Improved' : trend === 'down' ? 'Declined' : 'No change'}
              </span>
            </div>
            <span className="text-xs text-muted-foreground ml-auto">
              <Clock className="inline h-3 w-3 mr-1" />
              {assessments?.[0]?.createdAt ? 
                new Date(assessments[0].createdAt).toLocaleDateString() : 
                'N/A'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}