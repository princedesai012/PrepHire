import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aptitudeData from '../data/aptitudeData.json';

const AptitudeIntro = () => {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('medium');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartTest = () => {
    setIsLoading(true);
    
    // Generate questions from local JSON data
    const questions = generateQuestionsFromLocal(difficulty);
    sessionStorage.setItem('aptitudeQuestions', JSON.stringify(questions));
    sessionStorage.setItem('fromAptitudeIntro', 'true');
    sessionStorage.setItem('testDifficulty', difficulty);
    
    navigate('/aptitude-test');
    setIsLoading(false);
  };

  // Generate questions from local JSON data
  const generateQuestionsFromLocal = (difficulty) => {
    // Get questions from each category based on difficulty
    let quantitativeCount, logicalCount, verbalCount;
    
    if (difficulty === 'easy') {
      quantitativeCount = 12;
      logicalCount = 6;
      verbalCount = 12;
    } else if (difficulty === 'medium') {
      quantitativeCount = 15;
      logicalCount = 7;
      verbalCount = 8;
    } else { // hard
      quantitativeCount = 18;
      logicalCount = 8;
      verbalCount = 4;
    }
    
    // Get random questions from each category
    const quantitative = [...aptitudeData.quantitative]
      .sort(() => 0.5 - Math.random())
      .slice(0, quantitativeCount);
    
    const logical = [...aptitudeData.logical]
      .sort(() => 0.5 - Math.random())
      .slice(0, logicalCount);
    
    const verbal = [...aptitudeData.verbal]
      .sort(() => 0.5 - Math.random())
      .slice(0, verbalCount);
    
    // Combine and shuffle all questions
    const allQuestions = [...quantitative, ...logical, ...verbal]
      .sort(() => 0.5 - Math.random());
    
    return allQuestions;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">            

        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Aptitude Test
          </h1>
          <p className="text-xl text-muted-foreground">
            Assess your quantitative, logical, and verbal abilities
          </p>
        </div>

        {/* Difficulty Selection */}
        <div className="bg-card rounded-2xl shadow-xl p-8 mb-8 border animate-fade-in">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6 text-center">
            Select Difficulty Level
          </h2>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
            <button
              onClick={() => setDifficulty('easy')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                difficulty === 'easy' 
                  ? 'border-primary bg-primary/10 text-primary font-semibold' 
                  : 'border-border bg-background hover:bg-muted'
              }`}
            >
              <div className="text-lg font-medium mb-2">Easy</div>
              <div className="text-sm text-muted-foreground">Beginner Level</div>
            </button>
            
            <button
              onClick={() => setDifficulty('medium')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                difficulty === 'medium' 
                  ? 'border-primary bg-primary/10 text-primary font-semibold' 
                  : 'border-border bg-background hover:bg-muted'
              }`}
            >
              <div className="text-lg font-medium mb-2">Medium</div>
              <div className="text-sm text-muted-foreground">Intermediate Level</div>
            </button>
            
            <button
              onClick={() => setDifficulty('hard')}
              className={`p-4 rounded-xl border-2 text-center transition-all ${
                difficulty === 'hard' 
                  ? 'border-primary bg-primary/10 text-primary font-semibold' 
                  : 'border-border bg-background hover:bg-muted'
              }`}
            >
              <div className="text-lg font-medium mb-2">Hard</div>
              <div className="text-sm text-muted-foreground">Advanced Level</div>
            </button>
          </div>
        </div>

        {/* Test Details Card */}
        <div className="bg-card rounded-2xl shadow-xl p-8 mb-8 border animate-fade-in">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6 text-center">
            Test Details - {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-primary/10 rounded-xl border">
              <div className="text-3xl font-bold text-primary mb-2">30</div>
              <div className="text-card-foreground">Total Questions</div>
            </div>
            
            <div className="text-center p-6 bg-green-500/10 rounded-xl border">
              <div className="text-3xl font-bold text-green-600 mb-2">30</div>
              <div className="text-card-foreground">Minutes Duration</div>
            </div>
            
            <div className="text-center p-6 bg-purple-500/10 rounded-xl border">
              <div className="text-3xl font-bold text-purple-600 mb-2">3</div>
              <div className="text-card-foreground">Sections</div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-card-foreground mb-4">Test Structure</h3>
            
            <div className="bg-muted rounded-lg p-6 border">
              <h4 className="font-semibold text-primary mb-3">
                Quantitative Aptitude (
                {difficulty === 'easy' ? '12' : difficulty === 'medium' ? '15' : '18'} questions
                )
              </h4>
              <p className="text-muted-foreground">Math, percentages, data interpretation, and problem-solving</p>
            </div>
            
            <div className="bg-muted rounded-lg p-6 border">
              <h4 className="font-semibold text-green-600 mb-3">
                Logical Reasoning (
                {difficulty === 'easy' ? '6' : difficulty === 'medium' ? '7' : '8'} questions
                )
              </h4>
              <p className="text-muted-foreground">Patterns, series, puzzles, and analytical thinking</p>
            </div>
            
            <div className="bg-muted rounded-lg p-6 border">
              <h4 className="font-semibold text-purple-600 mb-3">
                Verbal Ability (
                {difficulty === 'easy' ? '12' : difficulty === 'medium' ? '8' : '4'} questions
                )
              </h4>
              <p className="text-muted-foreground">English comprehension, grammar, synonyms, and vocabulary</p>
            </div>
          </div>
        </div>

        {/* Instructions Card */}
        <div className="bg-card rounded-2xl shadow-xl p-8 mb-8 border animate-fade-in">
          <h2 className="text-2xl font-semibold text-card-foreground mb-6 text-center">
            Instructions
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm font-bold">1</span>
              </div>
              <div className="ml-3">
                <p className="text-card-foreground">The test has a 30-minute time limit</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm font-bold">2</span>
              </div>
              <div className="ml-3">
                <p className="text-card-foreground">You can navigate between questions using Next/Previous buttons</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm font-bold">3</span>
              </div>
              <div className="ml-3">
                <p className="text-card-foreground">Questions can be skipped and answered later</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm font-bold">4</span>
              </div>
              <div className="ml-3">
                <p className="text-card-foreground">The test will auto-submit when time expires</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center mt-1">
                <span className="text-primary text-sm font-bold">5</span>
              </div>
              <div className="ml-3">
                <p className="text-card-foreground">Once started, you cannot pause the test</p>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center animate-fade-in">
          <button
            onClick={handleStartTest}
            disabled={isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-12 rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Preparing Test...' : 'Start Aptitude Test'}
          </button>
          
          <p className="text-muted-foreground mt-4">
            Using questions from our local database
          </p>
        </div>
      </div>
    </div>
  );
};
export default AptitudeIntro;