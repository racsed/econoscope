'use client';

import { useState, useCallback } from 'react';
import { GraduationCap, RotateCcw, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getQuizBySlug } from '@/data/quizzes';

interface QuizBlockProps {
  moduleSlug: string;
  themeColor?: string;
}

const LETTER_LABELS = ['A', 'B', 'C', 'D'] as const;

export function QuizBlock({ moduleSlug, themeColor = '#6366F1' }: QuizBlockProps) {
  const quiz = getQuizBySlug(moduleSlug);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!quiz || quiz.questions.length === 0) return null;

  const totalQuestions = quiz.questions.length;
  const question = quiz.questions[currentIndex];
  const hasAnswered = selectedAnswer !== null;

  const handleSelect = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
    if (index === question.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
    } else {
      setFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setFinished(false);
  };

  const getOptionStyle = (index: number) => {
    if (!hasAnswered) {
      return 'border-border hover:border-text-muted hover:bg-bg-hover';
    }
    if (index === question.correctIndex) {
      return 'border-green-500 bg-green-500/10 text-green-700 dark:text-green-400';
    }
    if (index === selectedAnswer && index !== question.correctIndex) {
      return 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-400';
    }
    return 'border-border opacity-50';
  };

  const getLetterStyle = (index: number) => {
    if (!hasAnswered) {
      return { backgroundColor: `${themeColor}15`, color: themeColor };
    }
    if (index === question.correctIndex) {
      return { backgroundColor: 'rgb(34 197 94 / 0.15)', color: 'rgb(22 163 74)' };
    }
    if (index === selectedAnswer && index !== question.correctIndex) {
      return { backgroundColor: 'rgb(239 68 68 / 0.15)', color: 'rgb(220 38 38)' };
    }
    return { backgroundColor: 'rgb(156 163 175 / 0.1)', color: 'rgb(156 163 175)' };
  };

  return (
    <div className="bg-bg-card border border-border shadow-sm rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center gap-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${themeColor}15` }}
        >
          <GraduationCap size={18} style={{ color: themeColor }} />
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: themeColor }}>
            Testez votre comprehension
          </h3>
          {!finished && (
            <p className="text-xs text-text-muted mt-0.5">
              Question {currentIndex + 1} sur {totalQuestions}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <AnimatePresence mode="wait">
          {!finished ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Progress bar */}
              <div className="w-full h-1.5 bg-border rounded-full mb-5 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: themeColor }}
                  initial={false}
                  animate={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Question */}
              <p className="text-text-primary font-medium text-base mb-4 leading-relaxed">
                {question.question}
              </p>

              {/* Options */}
              <div className="space-y-2.5 mb-4">
                {question.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelect(index)}
                    disabled={hasAnswered}
                    className={`w-full text-left flex items-start gap-3 px-4 py-3 rounded-xl border transition-all duration-200 ${getOptionStyle(index)} ${!hasAnswered ? 'cursor-pointer' : 'cursor-default'}`}
                  >
                    <span
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 transition-colors duration-200"
                      style={getLetterStyle(index)}
                    >
                      {LETTER_LABELS[index]}
                    </span>
                    <span className="text-sm leading-relaxed pt-0.5">{option}</span>
                    {hasAnswered && index === question.correctIndex && (
                      <CheckCircle2 size={18} className="text-green-500 shrink-0 ml-auto mt-1" />
                    )}
                    {hasAnswered && index === selectedAnswer && index !== question.correctIndex && (
                      <XCircle size={18} className="text-red-500 shrink-0 ml-auto mt-1" />
                    )}
                  </button>
                ))}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {hasAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-bg-hover border border-border mb-4">
                      <p className="text-sm text-text-secondary leading-relaxed">
                        <span className="font-semibold text-text-primary">Explication : </span>
                        {question.explanation}
                      </p>
                    </div>

                    <button
                      onClick={handleNext}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                      style={{ backgroundColor: themeColor }}
                    >
                      {currentIndex < totalQuestions - 1 ? (
                        <>
                          Question suivante
                          <ArrowRight size={16} />
                        </>
                      ) : (
                        <>
                          Voir le resultat
                          <CheckCircle2 size={16} />
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="text-center py-6"
            >
              {/* Score circle */}
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5 border-4"
                style={{
                  borderColor: score === totalQuestions ? '#22c55e' : score >= totalQuestions / 2 ? themeColor : '#f59e0b',
                  backgroundColor: score === totalQuestions ? 'rgb(34 197 94 / 0.1)' : score >= totalQuestions / 2 ? `${themeColor}15` : 'rgb(245 158 11 / 0.1)',
                }}
              >
                <span className="text-3xl font-bold text-text-primary">
                  {score}/{totalQuestions}
                </span>
              </div>

              <p className="text-lg font-semibold text-text-primary mb-1">
                {score === totalQuestions
                  ? 'Excellent !'
                  : score >= totalQuestions / 2
                    ? 'Bien joue !'
                    : 'Continuez vos efforts !'}
              </p>
              <p className="text-sm text-text-secondary mb-6">
                {score === totalQuestions
                  ? 'Vous maitrisez parfaitement ce mecanisme.'
                  : score >= totalQuestions / 2
                    ? `${score} bonne${score > 1 ? 's' : ''} reponse${score > 1 ? 's' : ''} sur ${totalQuestions}. Vous etes sur la bonne voie.`
                    : `${score} bonne${score > 1 ? 's' : ''} reponse${score > 1 ? 's' : ''} sur ${totalQuestions}. Relisez le module et reessayez.`}
              </p>

              <button
                onClick={handleRetry}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 hover:shadow-md text-text-primary"
                style={{ borderColor: themeColor, color: themeColor }}
              >
                <RotateCcw size={16} />
                Recommencer le quiz
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default QuizBlock;
