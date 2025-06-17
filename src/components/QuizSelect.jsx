import React, {useState, useEffect} from 'react';
import supabase from "../api/supabaseClient.js";
import {useNavigate} from "react-router-dom";

function groupBy(arr, key) {
    return arr.reduce((acc, item) => {
        const group = item[key] || '기타';
        if (!acc[group]) acc[group] = [];
        acc[group].push(item);
        return acc;
    }, {});
}

function QuizSelect({quizBookList, onSelect}) {
    const [localList, setLocalList] = useState(quizBookList);
    const [expandedGroups, setExpandedGroups] = React.useState({});
    const [visibleGroups, setVisibleGroups] = React.useState(5);
    const observerRef = React.useRef();
    const lastGroupRef = React.useRef();
    const navigate = useNavigate()

    const grouped = groupBy(localList, 'group');
    const groupEntries = Object.entries(grouped);

    useEffect(() => {
        // 초기에 모든 그룹을 접힌 상태로 설정
        const initialExpanded = {};
        groupEntries.forEach(([group]) => {
            initialExpanded[group] = false;
        });
    }, [groupEntries]);

    useEffect(() => {
        const observer = new window.IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleGroups < groupEntries.length) {
                    setVisibleGroups((prev) => Math.min(prev + 5, groupEntries.length));
                }
            },
            {threshold: 0.1}
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

    const handleDelete = async (quizBookId) => {
        if (!window.confirm('정말 삭제하시겠습니까?')) return;
        try {
            // 1. 관련 quizzes 가져오기
            const {data: quizzes, error: quizFetchError} = await supabase
                .from('quizzes')
                .select('id')
                .eq('quiz_book_id', quizBookId);

            if (quizFetchError) throw quizFetchError;

            const quizIds = quizzes.map(q => q.id);

            // 2. quiz_choices 삭제
            if (quizIds.length > 0) {
                const {error: choiceDeleteError} = await supabase
                    .from('quiz_choices')
                    .delete()
                    .in('quiz_id', quizIds);

                if (choiceDeleteError) throw choiceDeleteError;
            }

            // 3. quizzes 삭제
            const {error: quizDeleteError} = await supabase
                .from('quizzes')
                .delete()
                .eq('quiz_book_id', quizBookId);

            if (quizDeleteError) throw quizDeleteError;

            // 4. quiz_book 삭제
            const {error: bookDeleteError} = await supabase
                .from('quiz_books')
                .delete()
                .eq('id', quizBookId);

            if (bookDeleteError) throw bookDeleteError;

            // 5. localList 업데이트
            setLocalList(prev => {
                const next = prev.filter(book => book.id !== quizBookId)
                if (next.length === 0) {
                    navigate('/')   // 홈으로 가면 QuizSelectPage에서 length===0 감지해서 EmptyTutorial 렌더
                }
                return next
            })
            alert('삭제 완료');

        } catch (err) {
            console.error(err);
            alert('삭제 중 오류 발생: ' + err.message);
        }
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
                                <li key={quiz.id} className="quiz-item">
                                    <div className="quiz-info">
                                        <strong>{quiz.title}</strong>
                                        <span>{quiz.description}</span>
                                    </div>
                                    <button className="start-btn" onClick={() => onSelect(quiz)}>
                                        시작
                                    </button>
                                    <button
                                        className="delete-btn bg-red-500 text-white px-3 py-1 rounded"
                                        onClick={() => handleDelete(quiz.id)}
                                    >
                                        삭제
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