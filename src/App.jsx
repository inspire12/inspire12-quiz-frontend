import React, { useState, useEffect } from 'react'
import './App.css'
import QuizSelect from './components/QuizSelect'
import {BrowserRouter, Routes, Route, useNavigate, useLocation} from 'react-router-dom'
import supabase from './api/supabaseClient'
import QuizSolve from "./components/QuizSolve.jsx";

function QuizSelectPage({ quizBookList }) {
  const navigate = useNavigate();
  const handleSelect = (quiz) => {
    navigate(`/quiz/${quiz.id}`, { state: { quiz } });
  };
  return <QuizSelect quizBookList={quizBookList} onSelect={handleSelect} />;
}

function QuizSolvePage({ quizBookList }) {
  const location = useLocation();
  const navigate = useNavigate();
  const quizBook = location.state?.quizzes || quizBookList.find(q => `/quiz/${q.id}` === location.pathname);
  const [quiz, setQuiz] = React.useState([]);
  const [choicesList, setChoicesList] = React.useState([]);
  const [loading_quiz, setQuizLoading] = React.useState(true);
  const [loading_choice, setChoiceLoading] = React.useState(true);

  useEffect(() => {
    if (!quizBook) return;
    setQuizLoading(true);
    setChoiceLoading(true)
    supabase
        .from('quizzes')
        .select('*')
        .eq('quiz_book_id', quizBook.id)
        .order('sort_order')
        .then(({ data, error }) => {
          setQuiz(data || []);
          setQuizLoading(false);
        });
    supabase
        .from('quiz_choices')
        .select('*')
        .eq('quiz_book_id', quizBook.id)
        .order('sort_order')
        .then(({ data, error }) => {
          setChoicesList(data || []);
          setChoiceLoading(false);
        });
  }, [quizBook]);


  if (!(!loading_quiz && !loading_choice)) return <div className="main-container quiz-page">로딩 중...</div>;

  const handleBack = () => {
    navigate('/');
  };
  return <QuizSolve quizzes={quiz} choicesList={choicesList} onBack={handleBack} />;
}


function App() {
  const [quizBookList, setQuizBookList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('quiz_books')
      .select('*')
      .then(({ data, error }) => {
        setQuizBookList(data || [])
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
          <Route path="/" element={<QuizSelectPage quizBookList={quizBookList}/>} />
          <Route path="/quiz/:quizId" element={<QuizSolvePage quizBookList={quizBookList} />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
