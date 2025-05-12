import React from 'react';

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key] || '기타';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

function QuizSelect({ quizList, onSelect }) {
  const grouped = groupBy(quizList, 'extra');
  return (
    <div className="main-container">
      <h1>퀴즈를 선택하세요</h1>
      {Object.entries(grouped).map(([group, quizzes]) => (
        <div key={group} style={{marginBottom: '2rem'}}>
          <h2 style={{color:'#3b82f6', fontSize:'1.2rem', marginBottom:'0.5rem'}}>{group}</h2>
          <ul className="quiz-list">
            {quizzes.map((quiz) => (
              <li key={quiz.file} className="quiz-item">
                <div className="quiz-info">
                  <strong>{quiz.title || quiz.file.replace('.md','')}</strong>
                  <span>{quiz.description}</span>
                </div>
                <button className="start-btn" onClick={() => onSelect(quiz)}>
                  시작
                </button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}

export default QuizSelect; 