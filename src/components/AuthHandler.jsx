// src/components/AuthHandler.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../api/supabaseClient'

export default function AuthHandler() {
    const navigate = useNavigate()

    useEffect(() => {
        const checkAndRedirect = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data: existing } = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single()

            if (existing) {
                navigate('/')
            } else {
                navigate('/signup')
            }
        }

        const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                checkAndRedirect()
            }
        })

        // 바로 세션이 있는 경우도 처리
        checkAndRedirect()

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    return null
}