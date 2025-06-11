import React from 'react'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import useQuizBooks from './hooks/useQuizBooks'

import QuizSolvePage from "./pages/QuizSolvePage.jsx";
import QuizSelectPage from "./pages/QuizSelectPage.jsx";
import QuizCreatePage from "./pages/QuizCreatePage.jsx";


function App() {
    const { quizBookList, loading } = useQuizBooks()

    if (loading) return <div className="main-container">로딩 중...</div>

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<QuizSelectPage quizBookList={quizBookList} />} />
                <Route path="/quiz/:quizId" element={<QuizSolvePage quizBookList={quizBookList} />} />
                <Route path="/create" element={<QuizCreatePage/>} />
            </Routes>
        </BrowserRouter>
    )
}

export default App