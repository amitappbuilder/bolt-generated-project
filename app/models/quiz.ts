import { Observable } from '@nativescript/core';

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  reference: string;
}

export class QuizModel extends Observable {
  private _questions: Question[] = [];
  private _currentScore = 0;
  private _totalQuestions = 0;

  get questions(): Question[] {
    return this._questions;
  }

  set questions(value: Question[]) {
    this._questions = value;
    this.notifyPropertyChange('questions', value);
  }

  get currentScore(): number {
    return this._currentScore;
  }

  set currentScore(value: number) {
    this._currentScore = value;
    this.notifyPropertyChange('currentScore', value);
  }

  addQuestion(question: Question) {
    this._questions.push(question);
    this._totalQuestions++;
    this.notifyPropertyChange('questions', this._questions);
  }

  checkAnswer(questionId: string, selectedAnswer: number): boolean {
    const question = this._questions.find(q => q.id === questionId);
    if (question && question.correctAnswer === selectedAnswer) {
      this._currentScore++;
      return true;
    }
    return false;
  }

  exportQuiz(): string {
    return JSON.stringify({
      questions: this._questions,
      score: this._currentScore,
      total: this._totalQuestions
    });
  }
}
