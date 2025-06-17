import {useLocation, useNavigate} from "react-router-dom";
import useQuizSet from "../hooks/useQuizSet.js";
import QuizSolve from "../components/QuizSolve.jsx";
import React from "react";
import useQuizBooks from "../hooks/useQuizBooks.js";

function QuizSolvePage() {
    const location = useLocation()
    const navigate = useNavigate()
    const {quizBookList} = useQuizBooks()

    const quizBook = location.state?.quiz || quizBookList.find(q => `/quiz/${q.id}` === location.pathname)
    const { quizzes, choicesList, loading } = useQuizSet(quizBook?.id)

    if (loading) return <div className="main-container">로딩 중...</div>
    return <QuizSolve quizzes={quizzes} choicesList={choicesList} onBack={() => navigate('/')} />
}

export default QuizSolvePage