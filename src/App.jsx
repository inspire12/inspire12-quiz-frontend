import React, { useState, useEffect } from 'react'
import './App.css'
import QuizSelect from './components/QuizSelect'
import QuizSolve from './components/QuizSolve'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'

function parseQuizMd(md) {
  // 문제별로 분리
  const blocks = md.split(/\n(?=\d+\. )/g).map(b => b.trim()).filter(Boolean)
  return blocks.map(block => {
    // 문제, 선택지, 정답, 해설 추출
    const lines = block.split('\n').map(l => l.trim()).filter(Boolean)
    const questionLine = lines[0]
    const choices = []
    let answer = ''
    let explanation = ''
    let type = 'choice'
    for (let i = 1; i < lines.length; i++) {
      if (/^[A-D]\. /.test(lines[i])) {
        choices.push(lines[i])
      } else if (lines[i].startsWith('정답:')) {
        answer = lines[i].replace('정답:', '').trim()
      } else if (lines[i].startsWith('해설:')) {
        explanation = lines[i].replace('해설:', '').trim()
      } else if (lines[i].includes('___') || lines[i].includes('□')) {
        type = 'blank'
      }
    }
    if (choices.length === 0) type = 'blank'
    return {
      question: questionLine,
      choices,
      answer,
      explanation,
      type
    }
  })
}

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
    fetch(`/data/${quiz.file}`)
      .then(res => res.text())
      .then(text => {
        setQuestions(parseQuizMd(text))
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
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QuizSelectPage quizList={quizList} />} />
        <Route path="/quiz/:quizId" element={<QuizSolvePage quizList={quizList} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
