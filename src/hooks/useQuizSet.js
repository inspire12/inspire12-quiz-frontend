import { useEffect, useState } from 'react'
import { fetchQuizzesWithChoices } from '../services/quizService'

export default function useQuizSet(quizBookId) {
    const [quizzes, setQuizzes] = useState([])
    const [choicesList, setChoicesList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!quizBookId) return
        setLoading(true)
        fetchQuizzesWithChoices(quizBookId).then(({ quizzes, choicesList }) => {
            setQuizzes(quizzes)
            setChoicesList(choicesList)
        }).finally(() => setLoading(false))
    }, [quizBookId])

    return { quizzes, choicesList, loading }
}