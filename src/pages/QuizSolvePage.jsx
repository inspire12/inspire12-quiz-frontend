import {useLocation, useNavigate} from "react-router-dom";
import useQuizSet from "../hooks/useQuizSet.js";
import QuizSolve from "../components/QuizSolve.jsx";
import React from "react";
function QuizSolvePage({ quizBookList }) {
    const location = useLocation()
    const navigate = useNavigate()
    const quizBook = location.state?.quiz || quizBookList.find(q => `/quiz/${q.id}` === location.pathname)
    const { quizzes, choicesList, loading } = useQuizSet(quizBook?.id)

    if (loading) return <div className="main-container">로딩 중...</div>
    return <QuizSolve quizzes={quizzes} choicesList={choicesList} onBack={() => navigate('/')} />
}

export default QuizSolvePage