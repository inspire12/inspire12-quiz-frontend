import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import AnimatedContainer from "../layouts/AnimationContainer.jsx"; // 상단에 추가

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key] || '기타';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

function QuizSolve({ quizzes, choicesList, onBack }) {
  // 상태 정의
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);
  const [animClass, setAnimClass] = useState('');
  const [score, setScore] = useState(0);
  const [showFinal, setShowFinal] = useState(false);
  const [answered, setAnswered] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const renderCnt = useRef(0);
  // quiz, choices를 계산된 값으로 사용
  const quiz = quizzes[currentIdx];
  const groupedChoices = useMemo(() => groupBy(choicesList, 'quiz_id'), [choicesList]);
  const choices = groupedChoices[quiz?.id] || [];

  console.log('렌더', ++renderCnt.current);

  // 퀴즈가 바뀌면 상태 초기화
  useEffect(() => {
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
    setAnimClass('');
    setShowExplanation(false);
  }, [currentIdx]);

  // 현재 문제 정보
  const isLast = currentIdx === quizzes.length - 1;
  const isFirst = currentIdx === 0;

  // 정답 판정 함수
  const checkCorrect = useCallback(
    (answer) => {
      if (!quiz) return false;
      if (quiz.type === 'choice') {
        return answer.trim().toUpperCase() === quiz.answer.trim().toUpperCase();
      } else {
        return answer.trim() === quiz.answer.trim();
      }
    },
    [quiz]
  );

  // 정답 제출
  const handleSubmit = (answer) => {
    const correct = checkCorrect(answer);
    setIsCorrect(correct);
    setShowResult(true);
    setAnimClass(correct ? 'correct-anim' : 'wrong-anim');
    setTimeout(() => setAnimClass(''), 700);
    if (correct && !answered[currentIdx]) {
      setScore((prev) => prev + 1);
      setAnswered((prev) => {
        const arr = [...prev];
        arr[currentIdx] = true;
        return arr;
      });
    }
  };

  // 다음 문제로 이동 또는 결과 보기
  const handleNext = () => {
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
    setShowExplanation(false);
    if (isLast) {
      setShowFinal(true);
    } else {
      setCurrentIdx((idx) => Math.min(idx + 1, quizzes.length - 1));
    }
  };

  // 이전 문제로 이동
  const handlePrev = () => {
    setUserAnswer('');
    setShowResult(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setCurrentIdx((idx) => Math.max(idx - 1, 0));
  };

  // 결과 화면
  if (showFinal) {
    return (
      <div className="main-container">
        <h1>퀴즈 결과</h1>
        <div className="quiz-question-box" style={{ fontSize: '1.3rem', fontWeight: 600, color: '#3b82f6', marginBottom: '2rem' }}>
          총 {quizzes.length}문제 중 {score}개 정답!
        </div>
        <button className="start-btn" onClick={onBack}>
          다시 선택하기
        </button>
      </div>
    );
  }

  if (!Array.isArray(quizzes) || quizzes.length === 0 || !quiz) {
    return <div className="main-container">퀴즈를 불러오는 중입니다...</div>
  }
  // 객관식 선택지 렌더링
  const renderChoices = () => (
    <div className="quiz-choices">
      {(choices.map((c, idx) => {
        const opt = c.label
        const label = c.label
        const content = c.content
        const isSelected = userAnswer === opt;
        const isAnswer = opt === quiz.answer;
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
            key={label}
            className={btnClass}
            disabled={showResult}
            onClick={() => {
              setUserAnswer(opt);
              handleSubmit(opt);
            }}
          >
            {label}. {content}
          </button>
        );
      }))}
    </div>
  );

  // 빈칸 문제 렌더링
  const renderBlank = () => (
    <div className="quiz-blank-box">
      <input
        className={`quiz-blank-input${showResult ? (isCorrect ? ' correct' : ' wrong') : ''}`}
        type="text"
        value={userAnswer}
        disabled={showResult}
        onChange={(e) => setUserAnswer(e.target.value)}
        placeholder="정답을 입력하세요"
      />
      <button className="start-btn" disabled={showResult || !userAnswer} onClick={() => handleSubmit(userAnswer)}>
        제출
      </button>
    </div>
  );

  // 정답/오답 결과 메시지
  const renderResult = () => {
    const isAnswerCorrect = checkCorrect(userAnswer);
    return (
      <div className={`quiz-result ${isAnswerCorrect ? 'correct' : 'wrong'}`}>
        <div className="result-header">
          <span className="result-text">
            {isAnswerCorrect ? '정답입니다!' : '오답입니다!'}
          </span>
          <button 
            className="explanation-toggle"
            onClick={() => setShowExplanation(!showExplanation)}
          >
            해설 {showExplanation ? '접기' : '보기'} {showExplanation ? '▼' : '▶'}
          </button>
        </div>
        
        <div className={`explanation-content ${showExplanation ? 'expanded' : ''}`}>
          <div className={`quiz-explanation ${isAnswerCorrect ? 'correct' : 'wrong'}`}>{quiz.explanation}</div>
        </div>

        <button className="start-btn" onClick={handleNext} style={{ marginTop: '1rem' }}>
          {isLast ? '결과 보기' : '다음 문제'}
        </button>
      </div>
    );
  };

  return (
    <div className="main-container">
      <div className="quiz-header-close">
        <button className="back-btn" onClick={onBack}>
          <span className="back-icon">✕</span>
        </button>
      </div>
      <div className="quiz-header">
        <AnimatedContainer keyId={quiz.id} className={`quiz-question-box ${animClass}`}>
            <h1>{quiz.question}</h1>
        </AnimatedContainer>

      </div>
      <div className="quiz-nav-buttons-top">
        <button
            className={`nav-btn prev-btn ${isFirst ? 'disabled' : ''}`}
            onClick={handlePrev}
            disabled={isFirst}
        >
          ← 이전
        </button>

        <button
            className={`nav-btn next-btn ${isLast ? 'disabled' : ''}`}
            onClick={handleNext}
            disabled={isLast}
        >
          다음 →
        </button>
      </div>

      <div className="quiz-navigation">

        <div className={`quiz-question-box ${animClass}`}>
          <AnimatedContainer keyId={quiz.id} className={`quiz-question-box ${animClass}`}>
            {quiz.type === 'choice' ? renderChoices() : renderBlank()}
            {showResult && renderResult()}
          </AnimatedContainer>
        </div>

      </div>
    </div>
  );
}

export default QuizSolve; 