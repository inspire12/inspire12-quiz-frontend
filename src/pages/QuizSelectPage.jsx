import {useNavigate} from "react-router-dom";
import QuizSelect from "../components/QuizSelect.jsx";
import React from "react";
import EmptyTutorial from "../components/EmptyTutorial.jsx";
import useQuizBooks from "../hooks/useQuizBooks.js";

function QuizSelectPage() {
    const navigate = useNavigate()

    const {quizBookList, loading} = useQuizBooks()
    if (loading) return <div className="main-container">로딩 중...</div>

    if (quizBookList.length === 0) {
        return <EmptyTutorial onCreate={() => navigate('/create')} />
    }
    return <QuizSelect quizBookList={quizBookList} onSelect={(quiz) => navigate(`/quiz/${quiz.id}`, { state: { quiz } })} />
}

export default QuizSelectPage;
