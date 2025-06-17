import { useState, useEffect } from 'react'
import supabase from '../api/supabaseClient'
import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
    const [nickname, setNickname] = useState('')
    const [userId, setUserId] = useState(null)
    const [errorMsg, setErrorMsg] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setUserId(user.id)
        }

        fetchUser()
    }, [])

    const handleCheckNickname = async (nickname) => {
        if (!nickname) return
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('nickname', nickname)
            .single()

        if (data) setErrorMsg('이미 사용 중인 닉네임입니다.')
        else setErrorMsg('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!userId || errorMsg) return

        const { error } = await supabase.from('users').insert({
            id: userId,
            nickname: nickname
        })

        if (error) {
            alert('계정 생성 실패: ' + error.message)
        } else {
            navigate('/')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="main-container">
            <label>
                닉네임:
                <input
                    type="text"
                    value={nickname}
                    onChange={(e) => {
                        setNickname(e.target.value)
                        handleCheckNickname(e.target.value).then(r => console.log(r))
                    }}
                    required
                />
            </label>
            {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            <button type="submit" disabled={!!errorMsg}>계정 생성</button>
        </form>
    )
}