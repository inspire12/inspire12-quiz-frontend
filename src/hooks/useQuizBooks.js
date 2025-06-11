import { useEffect, useState } from 'react'
import { fetchQuizBooks } from '../services/quizService'

export default function useQuizBooks() {
    const [quizBookList, setQuizBookList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchQuizBooks().then(setQuizBookList).finally(() => setLoading(false))
    }, [])

    return { quizBookList, loading }
}