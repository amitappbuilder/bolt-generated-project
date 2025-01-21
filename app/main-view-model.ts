import { Observable } from '@nativescript/core';
import { PDFProcessor } from './services/pdf-processor';
import { QuestionGenerator } from './services/question-generator';
import { QuizModel, Question } from './models/quiz';
import { File, knownFolders, path } from '@nativescript/core';
import { alert } from '@nativescript/core/ui/dialogs';

export class MainViewModel extends Observable {
  private _pdfUploaded = false;
  private _questionsGenerated = false;
  private _questionCount = 10;
  private _questions: Question[] = [];
  private _isLoading = false;
  private _pdfFileName = '';
  private quizModel: QuizModel;

  constructor() {
    super();
    this.quizModel = new QuizModel();
  }

  get pdfUploaded(): boolean {
    return this._pdfUploaded;
  }

  get questionsGenerated(): boolean {
    return this._questionsGenerated;
  }

  get questionCount(): number {
    return this._questionCount;
  }

  set questionCount(value: number) {
    if (value > 0 && value <= 50) {
      this._questionCount = value;
      this.notifyPropertyChange('questionCount', value);
    }
  }

  get questions(): Question[] {
    return this._questions;
  }

  get isLoading(): boolean {
    return this._isLoading;
  }

  get pdfFileName(): string {
    return this._pdfFileName;
  }

  async onUploadPDF() {
    try {
      this._isLoading = true;
      this.notifyPropertyChange('isLoading', true);

      // Simulated file picker for demo
      this._pdfFileName = 'sample-document.pdf';
      this._pdfUploaded = true;
      
      this.notifyPropertyChange('pdfFileName', this._pdfFileName);
      this.notifyPropertyChange('pdfUploaded', true);
    } catch (error) {
      console.error('Error uploading PDF:', error);
      await alert({
        title: 'Upload Error',
        message: 'Failed to upload PDF. Please try again.',
        okButtonText: 'OK'
      });
    } finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', false);
    }
  }

  async onGenerateQuestions() {
    try {
      this._isLoading = true;
      this.notifyPropertyChange('isLoading', true);

      const questionGenerator = QuestionGenerator.getInstance();
      const questions = await questionGenerator.generateQuestions('Sample text', this._questionCount);
      
      this._questions = questions;
      this._questionsGenerated = true;
      
      this.notifyPropertyChange('questions', questions);
      this.notifyPropertyChange('questionsGenerated', true);
      
      questions.forEach(q => this.quizModel.addQuestion(q));
    } catch (error) {
      console.error('Error generating questions:', error);
      await alert({
        title: 'Generation Error',
        message: 'Failed to generate questions. Please try again.',
        okButtonText: 'OK'
      });
    } finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', false);
    }
  }

  async onQuestionTap(args: any) {
    const question = this._questions[args.index];
    await alert({
      title: 'Question Details',
      message: `${question.text}\n\nDifficulty: ${question.difficulty}\nReference: ${question.reference}`,
      okButtonText: 'Close'
    });
  }

  async onExportQuiz() {
    try {
      this._isLoading = true;
      this.notifyPropertyChange('isLoading', true);

      const quizData = this.quizModel.exportQuiz();
      const documents = knownFolders.documents();
      const filePath = path.join(documents.path, 'quiz.json');
      
      const file = File.fromPath(filePath);
      await file.writeText(quizData);
      
      await alert({
        title: 'Success',
        message: 'Quiz has been exported successfully!',
        okButtonText: 'OK'
      });
    } catch (error) {
      console.error('Error exporting quiz:', error);
      await alert({
        title: 'Export Error',
        message: 'Failed to export quiz. Please try again.',
        okButtonText: 'OK'
      });
    } finally {
      this._isLoading = false;
      this.notifyPropertyChange('isLoading', false);
    }
  }
}
