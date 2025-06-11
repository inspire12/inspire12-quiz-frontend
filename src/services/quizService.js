import supabase from '../api/supabaseClient'

export async function fetchQuizBooks() {
    const { data, error } = await supabase
        .from('quiz_books')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function fetchQuizzesWithChoices(quizBookId) {
    const [quizRes, choiceRes] = await Promise.all([
        supabase
            .from('quizzes')
            .select('*')
            .eq('quiz_book_id', quizBookId)
            .order('sort_order'),
        supabase
            .from('quiz_choices')
            .select('*')
            .eq('quiz_book_id', quizBookId)
            .order('sort_order')
    ])

    if (quizRes.error || choiceRes.error) {
        throw quizRes.error || choiceRes.error
    }

    return {
        quizzes: quizRes.data || [],
        choicesList: choiceRes.data || []
    }
}