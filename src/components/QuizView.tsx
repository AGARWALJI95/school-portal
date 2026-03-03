import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Quiz } from '../types';

export function QuizView() {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    fetch('/api/quizzes').then(res => res.json()).then(setQuizzes);
  }, []);

  const handleAnswer = (index: number) => {
    if (!activeQuiz) return;
    if (index === activeQuiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    if (currentQuestion + 1 < activeQuiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFinished(true);
    }
  };

  if (activeQuiz) {
    return (
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-black/5 shadow-xl">
        {!finished ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-emerald-600">{activeQuiz.title}</h3>
              <span className="text-xs font-bold text-black/40">Question {currentQuestion + 1} of {activeQuiz.questions.length}</span>
            </div>
            <div className="h-2 bg-black/5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-emerald-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / activeQuiz.questions.length) * 100}%` }}
              />
            </div>
            <h2 className="text-xl font-bold">{activeQuiz.questions[currentQuestion].question}</h2>
            <div className="grid grid-cols-1 gap-3">
              {activeQuiz.questions[currentQuestion].options.map((option, i) => (
                <button 
                  key={i} 
                  onClick={() => handleAnswer(i)}
                  className="p-4 text-left rounded-2xl border border-black/5 hover:border-emerald-600 hover:bg-emerald-50 transition-all font-medium text-sm"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6 py-8">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-bold">Quiz Completed!</h2>
            <p className="text-black/60">You scored <span className="text-emerald-600 font-bold text-xl">{score}</span> out of {activeQuiz.questions.length}</p>
            <button 
              onClick={() => { setActiveQuiz(null); setFinished(false); setCurrentQuestion(0); setScore(0); }}
              className="bg-emerald-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-emerald-600/20"
            >
              Back to Quizzes
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold">Interactive Learning Quizzes</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quizzes.map(quiz => (
          <div key={quiz.id} className="bg-white p-6 rounded-2xl border border-black/5 shadow-sm hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              <BookOpen size={20} />
            </div>
            <h4 className="font-bold mb-2">{quiz.title}</h4>
            <p className="text-xs text-black/40 mb-4">{quiz.questions.length} Questions • Multiple Choice</p>
            <button 
              onClick={() => setActiveQuiz(quiz)}
              className="w-full py-2 rounded-xl bg-black/5 text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all"
            >
              Start Quiz
            </button>
          </div>
        ))}
        {/* Mock Add Quiz Button */}
        <div className="bg-dashed border-2 border-dashed border-black/10 rounded-2xl p-6 flex flex-col items-center justify-center text-black/30 hover:border-emerald-600/30 hover:text-emerald-600/50 transition-all cursor-pointer">
          <Plus size={32} className="mb-2" />
          <p className="text-xs font-bold uppercase tracking-wider">Create New Quiz</p>
        </div>
      </div>
    </div>
  );
}
