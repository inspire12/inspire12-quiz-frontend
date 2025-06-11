
import React, { useState } from 'react';

// 전체 JSON 구조를 입력으로 받고 미리보기
function QuizJsonImporter() {
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
                    alert(`${file.name}은 유효한 퀴즈 JSON 구조가 아닙니다.`);
                }
            } catch (err) {
                alert(`${file.name} 읽기 실패: ${err.message}`);
            }
        }

        setQuizBooks(loaded);
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">📥 퀴즈 JSON 파일 업로드</h1>

            <input
                type="file"
                accept=".json"
                multiple
                onChange={handleFiles}
                className="mb-6"
            />

            {quizBooks.length > 0 && (
                <div className="space-y-6">
                    {quizBooks.map((book, idx) => (
                        <div key={idx} className="border rounded-lg shadow p-4 bg-white">
                            <h2 className="text-xl font-semibold mb-2">
                                📚 {book.title} <span className="text-gray-500 text-sm">({book.fileName})</span>
                            </h2>
                            <ul className="list-disc pl-5 text-sm text-gray-800">
                                {book.quizzes.slice(0, 5).map((quiz) => (
                                    <li key={quiz.id}>{quiz.question}</li>
                                ))}
                            </ul>
                            {book.quizzes.length > 5 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    ...총 {book.quizzes.length}문제
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default QuizJsonImporter;