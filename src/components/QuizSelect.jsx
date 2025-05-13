import React, { useState, useEffect, useRef } from 'react';

function groupBy(arr, key) {
  return arr.reduce((acc, item) => {
    const group = item[key] || '기타';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});
}

function QuizSelect({ quizList, onSelect }) {
  const [expandedGroups, setExpandedGroups] = useState({});
  const [visibleGroups, setVisibleGroups] = useState(5);
  const observerRef = useRef();
  const lastGroupRef = useRef();

  const grouped = groupBy(quizList, 'extra');
  const groupEntries = Object.entries(grouped);

  useEffect(() => {
    // 초기에 모든 그룹을 접힌 상태로 설정
    const initialExpanded = {};
    groupEntries.forEach(([group]) => {
      initialExpanded[group] = false;
    });
    setExpandedGroups(initialExpanded);
  }, [quizList]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleGroups < groupEntries.length) {
          setVisibleGroups((prev) => Math.min(prev + 5, groupEntries.length));
        }
      },
      { threshold: 0.1 }
    );

    if (lastGroupRef.current) {
      observer.observe(lastGroupRef.current);
    }

    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [visibleGroups, groupEntries.length]);

  const toggleGroup = (group) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group]
    }));
  };

  return (
    <div className="main-container">
      <h1>퀴즈를 선택하세요</h1>
      {groupEntries.slice(0, visibleGroups).map(([group, quizzes], index) => (
        <div 
          key={group} 
          className="quiz-group"
          ref={index === visibleGroups - 1 ? lastGroupRef : null}
        >
          <div 
            className="quiz-group-header"
            onClick={() => toggleGroup(group)}
          >
            <span className={`toggle-icon ${expandedGroups[group] ? 'expanded' : ''}`}>
              ▶
            </span>
            {group} ({quizzes.length})
          </div>
          <div className={`quiz-group-content ${expandedGroups[group] ? 'expanded' : ''}`}>
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
        </div>
      ))}
      {visibleGroups < groupEntries.length && (
        <div className="load-more">
          <span>스크롤하여 더 보기...</span>
        </div>
      )}
    </div>
  );
}

export default QuizSelect; 