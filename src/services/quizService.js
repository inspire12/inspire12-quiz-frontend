import supabase from '../api/supabaseClient'

const example = [{
    title: "내 첫 퀴즈북",
    description: "GPTER로 만든 퀴즈",
    group: "튜토리얼",
    quizzes: [
        {
            question: "JS에서 변수 선언 키워드?",
            answer: "const",
            type: "choice",
            group: "Tutorial",
            quiz_choices: [
                { label: "A", content: "var" },
                { label: "B", content: "let" },
                { label: "C", content: "const" },
                { label: "D", content: "class" }
            ]
        }
    ]
}]

export async function fetchQuizBooks() {
    const { data: { user } } = await supabase.auth.getUser();
    const guestId = localStorage.getItem('guestId');

    let query = supabase.from('quiz_books').select('*');
    if (user) {
        query = query.eq('user_id', user.id);
    } else {
        query = query.eq('guest_id', guestId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
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