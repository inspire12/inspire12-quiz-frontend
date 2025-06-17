// src/pages/QuizCreatePage.jsx

import React, { useState } from 'react';
import supabase from '../api/supabaseClient';
import QuizImportBox from "../components/QuizImportBox.jsx";
import { getGuestId } from '../utils/guest';

function QuizCreatePage() {
    const [jsonInput, setJsonInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [quizBooks, setQuizBooks] = useState([]);

    const handleFiles = async (e) => {
        const files = Array.from(e.target.files);
        const loaded = [];

        for (let file of files) {
            try {
                const text = await file.text();
                const parsed = JSON.parse(text);
                if (parsed.title && Array.isArray(parsed.quizzes)) {
                    loaded.push({ fileName: file.name, ...parsed });
                } else {
                    alert(`${file.name}은 올바른 퀴즈 JSON이 아님`);
                }
            } catch (err) {
                alert(`${file.name} 읽기 실패: ${err.message}`);
            }
        }

        setQuizBooks(loaded);
    };

    const handleSubmitText = async () => {
        try {
            setLoading(true);
            const parsed = JSON.parse(jsonInput);
            const guestId = getGuestId();

            const quizBook = {
                title: parsed.title,
                description: parsed.description || '',
                group: parsed.group || '',
                total_quizzes: parsed.quizzes.length,
                guest_id: guestId  // <- 손님 식별자
            };

            const { data: bookData, error: bookError } = await supabase
                .from('quiz_books')
                .insert([quizBook])
                .select('id');

            if (bookError) throw bookError;

            const quizBookId = bookData[0].id;

            for (const [i, quiz] of parsed.quizzes.entries()) {
                const { quiz_choices, ...quizData } = quiz;

                const { data: quizDataResult, error: quizError } = await supabase
                    .from('quizzes')
                    .insert([{
                        quiz_book_id: quizBookId,
                        question: quizData.question,
                        answer: quizData.answer,
                        explanation: quizData.explanation,
                        type: quizData.type,
                        sort_order: i
                    }])
                    .select('id');

                if (quizError) throw quizError;

                const quizId = quizDataResult[0].id;

                if (quiz.type === 'choice' && quiz_choices?.length > 0) {
                    await supabase.from('quiz_choices').insert(
                        quiz_choices.map((c, idx) => ({
                            quiz_book_id: quizBookId,
                            quiz_id: quizId,
                            label: c.label,
                            content: c.content,
                            sort_order: idx
                        }))
                    );
                }
            }

            alert('텍스트 입력 퀴즈 저장 완료');
        } catch (e) {
            console.error(e);
            alert('퀴즈 저장 실패');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitBook = async (book) => {
        try {
            setLoading(true);

            const quizBook = {
                title: book.title,
                description: book.description || '',
                group: book.group || '',
                total_quizzes: book.quizzes?.length || 0
            };

            const { data: bookData, error: bookError } = await supabase
                .from('quiz_books')
                .insert([quizBook])
                .select('id');

            if (bookError) throw bookError;
            const quizBookId = bookData[0].id;

            for (const [i, quiz] of book.quizzes.entries()) {
                const { quiz_choices, ...quizData } = quiz;

                const { data: quizDataResult, error: quizError } = await supabase
                    .from('quizzes')
                    .insert([{
                        quiz_book_id: quizBookId,
                        question: quizData.question,
                        answer: quizData.answer,
                        explanation: quizData.explanation,
                        type: quizData.type,
                        sort_order: i
                    }])
                    .select('id');

                if (quizError) throw quizError;

                const quizId = quizDataResult[0].id;

                if (quiz.type === 'choice' && quiz_choices?.length > 0) {
                    const { error: choiceError } = await supabase
                        .from('quiz_choices')
                        .insert(
                            quiz_choices.map((c, idx) => ({
                                quiz_book_id: quizBookId,
                                quiz_id: quizId,
                                label: c.label,
                                content: c.content,
                                sort_order: idx
                            }))
                        );

                    if (choiceError) throw choiceError;
                }
            }

            alert(`"${book.title}" 저장 완료`);
        } catch (e) {
            console.error(e);
            alert(`"${book.title}" 저장 실패`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="main-container p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">JSON으로 퀴즈 세트 등록</h1>

            <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                placeholder='{"title": "My Quiz", "quizzes": [{"question": ..., "answer": ..., ...}]}'
                rows={20}
                style={{ width: '100%', fontFamily: 'monospace' }}
                className="mb-4 border p-2 rounded w-full"
            />
            <button
                onClick={handleSubmitText}
                className="start-btn bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                disabled={loading}
            >
                {loading ? '저장 중...' : '텍스트 입력 저장하기'}
            </button>

            <div className="mt-10 border-t pt-6">
                <h2 className="text-xl font-semibold mb-3">📥 JSON 파일로 퀴즈 등록</h2>
                <input
                    type="file"
                    accept=".json"
                    multiple
                    onChange={handleFiles}
                    className="mb-4"
                />

                {quizBooks.map((book, idx) => (
                    <div key={idx} className="mb-4 p-4 border rounded bg-white shadow">
                        <h3 className="font-bold text-lg">{book.title}</h3>
                        <ul className="list-disc ml-6 text-sm mt-2">
                            {book.quizzes.slice(0, 5).map((q, i) => (
                                <li key={i}>{q.question}</li>
                            ))}
                        </ul>
                        {book.quizzes.length > 5 && (
                            <p className="text-sm text-gray-500 mt-1">
                                ...총 {book.quizzes.length}문제
                            </p>
                        )}
                        <button
                            className="mt-3 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                            onClick={() => handleSubmitBook(book)}
                            disabled={loading}
                        >
                            {loading ? '저장 중...' : '이 퀴즈북 저장하기'}
                        </button>
                    </div>
                ))}
            </div>
            <QuizImportBox />
        </div>
    );
}

export default QuizCreatePage;