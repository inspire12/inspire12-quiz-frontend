// src/components/QuizImportBox.jsx
import {useState} from 'react'
import supabase from '../api/supabaseClient'

export default function QuizImportBox() {
    const [quizBookId, setQuizBookId] = useState('')
    const [loading, setLoading] = useState(false)

    const handleImport = async () => {
        setLoading(true)
        const {data: {user}} = await supabase.auth.getUser()
        if (!user) return alert('로그인이 필요합니다.')

        try {
            const {data: book, error: bookError} = await supabase
                .from('quiz_books')
                .select('*')
                .eq('id', quizBookId)
                .single()

            if (bookError || !book) throw bookError || new Error('해당 퀴즈북이 없습니다')

            const {data: quizzes} = await supabase
                .from('quizzes')
                .select('*')
                .eq('quiz_book_id', quizBookId)

            const {data: choices} = await supabase
                .from('quiz_choices')
                .select('*')
                .eq('quiz_book_id', quizBookId)

            const {data: newBook, error: insertBookErr} = await supabase
                .from('quiz_books')
                .insert([{
                    title: book.title + ' (복사본)',
                    description: book.description,
                    group: book.group,
                    total_quizzes: quizzes.length
                }])
                .select('id')
                .single()

            if (insertBookErr) throw insertBookErr
            const newQuizBookId = newBook.id

            const quizIdMap = {}
            for (const [i, quiz] of quizzes.entries()) {
                const {data: newQuiz} = await supabase
                    .from('quizzes')
                    .insert([{
                        quiz_book_id: newQuizBookId,
                        question: quiz.question,
                        answer: quiz.answer,
                        explanation: quiz.explanation,
                        type: quiz.type,
                        sort_order: i
                    }])
                    .select('id')
                    .single()
                quizIdMap[quiz.id] = newQuiz.id
            }

            const newChoices = choices.map((c) => ({
                quiz_book_id: newQuizBookId,
                quiz_id: quizIdMap[c.quiz_id],
                label: c.label,
                content: c.content,
                sort_order: c.sort_order
            }))

            if (newChoices.length > 0) {
                await supabase.from('quiz_choices').insert(newChoices)
            }

            alert('퀴즈북 복사 완료!')
        } catch (e) {
            console.error(e)
            alert('복사 중 오류: ' + e.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h2 className="text-xl font-semibold mb-3">📥 퀴즈 id로 import</h2>
            <div style={{margin: '2rem 0', display: 'flex'}}>
                <input
                    type="text"
                    placeholder="가져올 퀴즈북 ID 입력"
                    value={quizBookId}
                    onChange={(e) => setQuizBookId(e.target.value)}
                    style={{padding: '0.5rem', width: '60%'}}
                />
                <button
                    onClick={handleImport}
                    disabled={!quizBookId || loading}
                    style={{
                        marginLeft: '1rem',
                        padding: '0.5rem 1rem',
                        background: '#2563eb',
                        color: 'white',
                        wordBreak: 'keep-all',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? '복사 중...' : '가져오기'}
                </button>
            </div>
        </div>
    )
}
