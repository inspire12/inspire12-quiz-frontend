import {useNavigate} from "react-router-dom";
import QuizSelect from "../components/QuizSelect.jsx";
import React from "react";

function QuizSelectPage({ quizBookList }) {
    const navigate = useNavigate()
    return <QuizSelect quizBookList={quizBookList} onSelect={(quiz) => navigate(`/quiz/${quiz.id}`, { state: { quiz } })} />
}

export default QuizSelectPage;
