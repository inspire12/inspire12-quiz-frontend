import React, { useState, useEffect } from 'react'
import './App.css'
import QuizSelect from './components/QuizSelect'
import QuizSolve from './components/QuizSolve'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import MdToJsonConverter from './components/MdToJsonConverter.jsx'

function QuizSelectPage({ quizList }) {
  const navigate = useNavigate();
  const handleSelect = (quiz) => {
    navigate(`/quiz/${quiz.file.replace('.md','')}`, { state: { quiz } });
  };
  return <QuizSelect quizList={quizList} onSelect={handleSelect} />;
}

function QuizSolvePage({ quizList }) {
  const location = useLocation();
  const navigate = useNavigate();
  const quiz = location.state?.quiz || quizList.find(q => `/quiz/${q.file.replace('.md','')}` === location.pathname);
  const [questions, setQuestions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    if (!quiz) return;
    setLoading(true);
    fetch(`/data/${quiz.file.replace('.md', '.json')}`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data)
        setLoading(false)
      })
      .catch(() => {
        setQuestions([])
        setLoading(false)
      })
  }, [quiz])

  if (!quiz || loading) return <div className="main-container">로딩 중...</div>;

  const handleBack = () => {
    navigate('/');
  };

  return <QuizSolve quiz={quiz} questions={questions} onBack={handleBack} />;
}

function App() {
  const [quizList, setQuizList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/data/meta.json')
      .then(res => res.json())
      .then(data => {
        setQuizList(data.quizzes)
        setLoading(false)
      })
      .catch(() => {
        setQuizList([])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="main-container">로딩 중...</div>
  }

  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<QuizSelectPage quizList={quizList} />} />
          <Route path="/quiz/:quizId" element={<QuizSolvePage quizList={quizList} />} />
          <Route path="/convert" element={<MdToJsonConverter />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
