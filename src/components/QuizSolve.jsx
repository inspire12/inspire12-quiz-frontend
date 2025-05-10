import React, { useState, useEffect } from 'react';

function QuizSolve({ quiz, questions, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(null)
  const [animClass, setAnimClass] = useState('')
  const [score, setScore] = useState(0)
  const [showFinal, setShowFinal] = useState(false)
  const [answered, setAnswered] = useState(Array(questions.length).fill(false));

  useEffect(() => {
    setCurrentIdx(0)
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(null)
    setAnimClass('')
    setScore(0)
    setShowFinal(false)
    setAnswered(Array(questions.length).fill(false))
  }, [quiz, questions])

  const q = questions[currentIdx]
  const isLast = currentIdx === questions.length - 1
  const isFirst = currentIdx === 0

  const handleSubmit = (answer) => {
    let correct = false;
    if (q.type === 'choice') {
      correct = answer.trim().toUpperCase() === q.answer.trim().toUpperCase();
    } else {
      correct = answer.trim() === q.answer.trim();
    }
    setIsCorrect(correct);
    setShowResult(true);
    setAnimClass(correct ? 'correct-anim' : 'wrong-anim');
    setTimeout(() => setAnimClass(''), 700);
    if (correct && !answered[currentIdx]) {
      setScore(prev => prev + 1);
      setAnswered(prev => {
        const arr = [...prev];
        arr[currentIdx] = true;
        return arr;
      });
    }
  };

  const handleNext = () => {
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(null)
    if (isLast) {
      setShowFinal(true)
    } else {
      setCurrentIdx(idx => Math.min(idx + 1, questions.length - 1))
    }
  }

  const handlePrev = () => {
    setUserAnswer('')
    setShowResult(false)
    setIsCorrect(null)
    setCurrentIdx(idx => Math.max(idx - 1, 0))
  }

  if (showFinal) {
    return (
      <div className="main-container">
        <h1>퀴즈 결과</h1>
        <div className="quiz-question-box" style={{fontSize:'1.3rem', fontWeight:600, color:'#3b82f6', marginBottom:'2rem'}}>
          총 {questions.length}문제 중 {score}개 정답!
        </div>
        <button className="start-btn" onClick={onBack}>
          다시 선택하기
        </button>
      </div>
    )
  }

  return (
    <div className="main-container">
      <h1>{quiz?.title || quiz?.file.replace('.md','')}</h1>
      <div className={`quiz-question-box ${animClass}`}>
        <div className="quiz-q">{q.question}</div>
        {q.type === 'choice' ? (
          <div className="quiz-choices">
            {q.choices.map((c, idx) => {
              const opt = c[0]
              const isSelected = userAnswer === opt
              const isAnswer = opt === q.answer
              let btnClass = 'quiz-choice-btn';
              if (showResult) {
                if (isAnswer && isSelected) {
                  btnClass += ' correct correct-anim-strong';
                } else if (isAnswer) {
                  btnClass += ' correct';
                } else if (isSelected && !isAnswer) {
                  btnClass += ' wrong';
                }
              }
              return (
                <button
                  key={c}
                  className={btnClass}
                  disabled={showResult}
                  onClick={() => {
                    setUserAnswer(opt);
                    handleSubmit(opt);
                  }}
                >
                  {c}
                </button>
              )
            })}
          </div>
        ) : (
          <div className="quiz-blank-box">
            <input
              className={`quiz-blank-input${showResult ? (isCorrect ? ' correct' : ' wrong') : ''}`}
              type="text"
              value={userAnswer}
              disabled={showResult}
              onChange={e => setUserAnswer(e.target.value)}
              placeholder="정답을 입력하세요"
            />
            <button className="start-btn" disabled={showResult || !userAnswer} onClick={() => handleSubmit(userAnswer)}>
              제출
            </button>
          </div>
        )}
        {showResult && (
          <div className={`quiz-result ${userAnswer.trim().toUpperCase() === q.answer.trim().toUpperCase() ? 'correct' : 'wrong'}`}> 
            {userAnswer.trim().toUpperCase() === q.answer.trim().toUpperCase() ? '정답입니다!' : '오답입니다!'}
            <div className="quiz-explanation">{q.explanation}</div>
            <button className="start-btn" onClick={handleNext}>
              {isLast ? '결과 보기' : '다음 문제'}
            </button>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
        <button className="start-btn" onClick={handlePrev} disabled={isFirst}>
          이전 문제
        </button>
        <button className="start-btn" onClick={handleNext} disabled={isLast}>
          다음 문제
        </button>
      </div>
      <button className="start-btn" style={{marginTop:'2rem'}} onClick={onBack}>
        돌아가기
      </button>
    </div>
  )
}

export default QuizSolve; 