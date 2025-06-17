// services/wrongNoteService.js
import supabase from '../api/supabaseClient'

export async function fetchMyWrongNotes() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('로그인 필요')

    const { data, error } = await supabase
        .from('quiz_wrong_notes')
        .select(`
      *,
      quizzes (
        question,
        explanation
      )
    `)
        .eq('user_id', user.id)

    if (error) throw error
    return data
}