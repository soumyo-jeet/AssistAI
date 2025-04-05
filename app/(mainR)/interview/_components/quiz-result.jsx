"use client";

import { Trophy, CheckCircle2, XCircle, BookOpen, ChevronRight, Zap, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

export default function QuizResult({
  result,
  hideStartNew = false,
  onStartNew,
}) {
  if (!result) return null;

  const correctCount = result.questions.filter(q => q.isCorrect).length;
  const totalQuestions = result.questions.length;
  const percentage = Math.round(result.quizScore);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding performance!";
    if (percentage >= 70) return "Great job!";
    if (percentage >= 50) return "Good effort!";
    return "Keep practicing!";
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header with results summary */}
      <div className="text-center space-y-4 p-6 bg-gradient-to-br from-primary/5 to-muted/50 rounded-xl border">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-2 mx-auto">
          <Trophy className="h-8 w-8 text-primary" />
        </div>
        
        <h1 className="text-3xl font-bold text-primary">
          {getPerformanceMessage()}
        </h1>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <Badge className="flex items-center gap-1.5 px-3 py-1">
            <span className="font-mono text-lg">{percentage}%</span>
            <span>Score</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1.5 px-3 py-1">
            <CheckCircle2 className="h-4 w-4 text-green-500" />
            <span>{correctCount}/{totalQuestions} Correct</span>
          </Badge>
        </div>
        
        <Progress value={percentage} className="h-3 w-full max-w-[300px] mx-auto" />
      </div>

      <CardContent className="space-y-6">
        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100 space-y-2">
            <div className="flex items-center gap-2 text-blue-600">
              <Zap className="h-5 w-5" />
              <h3 className="font-semibold">Improvement Tip</h3>
            </div>
            <p className="pl-7">{result.improvementTip}</p>
          </div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
            <h3>Question Review</h3>
          </div>
          
          <div className="space-y-3">
            {result.questions.map((q, index) => (
              <div 
                key={index} 
                className={`border rounded-xl p-4 space-y-3 ${q.isCorrect ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{q.question}</p>
                  {q.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-1" />
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-white p-2 rounded-lg border">
                    <p className="font-medium text-muted-foreground">Your answer</p>
                    <p className="text-gray-800">{q.userAnswer || 'Skipped'}</p>
                  </div>
                  {!q.isCorrect && (
                    <div className="bg-white p-2 rounded-lg border">
                      <p className="font-medium text-muted-foreground">Correct answer</p>
                      <p className="text-gray-900">{q.answer}</p>
                    </div>
                  )}
                </div>
                
                {q.explanation && (
                  <div className="bg-white p-3 rounded-lg border text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                      <Lightbulb className="h-4 w-4" />
                      <span className="font-medium">Explanation</span>
                    </div>
                    <p className="text-gray-800">{q.explanation}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>

      {!hideStartNew && (
        <CardFooter className="pt-4">
          <Button 
            onClick={onStartNew} 
            className="w-full py-6 text-lg group"
            size="lg"
          >
            Start New Quiz
            <ChevronRight className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" />
          </Button>
        </CardFooter>
      )}
    </div>
  );
}