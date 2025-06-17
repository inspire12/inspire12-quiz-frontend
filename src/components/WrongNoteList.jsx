// components/WrongNoteList.jsx
import { useEffect, useState } from 'react'
import { fetchMyWrongNotes } from '../services/wrongNoteService'

export default function WrongNoteList() {
    const [notes, setNotes] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchMyWrongNotes()
            .then(setNotes)
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="main-container">오답노트를 불러오는 중...</div>

    if (notes.length === 0) return <div className="main-container">오답노트가 없습니다.</div>

    return (
        <div className="main-container">
            <h1>📘 나의 오답노트</h1>
            {notes.map((note) => (
                <div key={note.quiz_id} style={{ marginBottom: '1.5rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
                    <h2 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{note.quizzes?.question}</h2>
                    <p style={{ color: '#ef4444', fontWeight: 500 }}>✍ 내 노트: {note.note}</p>
                    {note.quizzes?.explanation && (
                        <details style={{ marginTop: '0.5rem' }}>
                            <summary style={{ cursor: 'pointer', color: '#3b82f6' }}>해설 보기</summary>
                            <p>{note.quizzes.explanation}</p>
                        </details>
                    )}
                </div>
            ))}
        </div>
    )
}