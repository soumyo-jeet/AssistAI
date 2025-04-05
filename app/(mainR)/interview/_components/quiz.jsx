"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { generateQuiz, saveQuizResult } from "@/actions/interview";
import QuizResult from "./quiz-result";
import useFetch from "@/hooks/use-fetch";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Lightbulb, Trophy, Clock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData,
  } = useFetch(saveQuizResult);

  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
    setSelectedOption(answer);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setSelectedOption(null);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / quizData.length) * 100);
  };

  const finishQuiz = async () => {
    const score = calculateScore();
    try {
      await saveQuizResultFn(quizData, answers, score);
      toast.success(
        `Quiz completed! You scored ${score}%`,
        { icon: <Trophy className="w-5 h-5 text-yellow-500" /> }
      );
    } catch (error) {
      toast.error(error.message || "Failed to save quiz results");
    }
  };

  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    setSelectedOption(null);
    generateQuizFn();
    setResultData(null);
  };

  if (generatingQuiz) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-lg font-medium">Preparing your quiz...</span>
        </div>
        <Progress value={0} className="w-[60%] h-2" />
      </div>
    );
  }

  if (resultData) {
    return (
      <div className="mx-auto max-w-3xl">
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (!quizData) {
    return (
      <Card className="mx-auto max-w-2xl bg-gradient-to-br from-background to-muted/50">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Knowledge Challenge</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            Test your expertise with 10 carefully crafted questions tailored to your industry.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>5-10 minutes</span>
            </Badge>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              <span>Detailed explanations</span>
            </Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={generateQuizFn} 
            className="w-full py-6 text-lg"
            size="lg"
          >
            Start Challenge
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = quizData[currentQuestion];
  const progress = ((currentQuestion + 1) / quizData.length) * 100;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          Question {currentQuestion + 1} of {quizData.length}
        </span>
        <Progress value={progress} className="w-[60%] h-2" />
      </div>

      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl">{question.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <RadioGroup
            onValueChange={handleAnswer}
            value={answers[currentQuestion]}
            className="space-y-3"
          >
            {question.options.map((option, index) => (
              <div 
                key={index} 
                className={`flex items-center space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedOption === option 
                    ? "border-primary bg-primary/5" 
                    : "hover:border-muted-foreground/30 hover:bg-muted/50"
                }`}
                onClick={() => handleAnswer(option)}
              >
                <RadioGroupItem 
                  value={option} 
                  id={`option-${index}`} 
                  className="h-5 w-5"
                />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="text-base cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {showExplanation && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-muted animate-in fade-in">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <p className="font-medium">Explanation</p>
              </div>
              <p className="text-muted-foreground">{question.explanation}</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          {!showExplanation && answers[currentQuestion] && (
            <Button
              onClick={() => setShowExplanation(true)}
              variant="outline"
              className="w-full"
            >
              <Lightbulb className="h-4 w-4 mr-2" />
              Show Explanation
            </Button>
          )}
          <Button
            onClick={handleNext}
            disabled={!answers[currentQuestion] || savingResult}
            className="w-full py-6 text-lg"
            size="lg"
          >
            {currentQuestion < quizData.length - 1 ? (
              <>
                {answers[currentQuestion] ? "Next Question" : "Select an answer to continue"}
                {answers[currentQuestion] && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 ml-2"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                )}
              </>
            ) : (
              "Finish Quiz"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}