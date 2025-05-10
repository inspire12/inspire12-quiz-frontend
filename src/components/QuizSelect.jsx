import React from 'react';

function QuizSelect({ quizList, onSelect }) {
  return (
    <div className="main-container">
      <h1>퀴즈를 선택하세요</h1>
      <ul className="quiz-list">
        {quizList.map((quiz) => (
          <li key={quiz.file} className="quiz-item">
            <div className="quiz-info">
              <strong>{quiz.title || quiz.file.replace('.md','')}</strong>
              <span>{quiz.description}</span>
              {quiz.extra && <span style={{color:'#3b82f6', fontSize:'0.95rem'}}>{quiz.extra}</span>}
            </div>
            <button className="start-btn" onClick={() => onSelect(quiz)}>
              시작
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default QuizSelect; 