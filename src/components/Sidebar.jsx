// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import supabase from '../api/supabaseClient'
import QuizImportBox from './QuizImportBox.jsx'

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(true)
    const [user, setUser] = useState(null)
    const [nickname, setNickname] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserInfo = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
            if (user) {
                const { data: existingUser } = await supabase
                    .from('users')
                    .select('nickname')
                    .eq('id', user.id)
                    .single()
                if (existingUser?.nickname) setNickname(existingUser.nickname)
                else navigate('/signup')
            } else {
                setNickname('')
            }
        }
        fetchUserInfo()
        const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
            setUser(session?.user || null)
            fetchUserInfo()
        })
        return () => authListener.subscription.unsubscribe()
    }, [navigate])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        navigate('/')
    }

    const handleNavigate = (path) => {
        setCollapsed(true)
        navigate(path)
    }

    return (
        <>
            {/* 햄버거 버튼 */}
            <button
                className="sidebar-toggle"
                onClick={() => setCollapsed(!collapsed)}
            >
                ☰
            </button>

            <div className={`sidebar ${collapsed ? 'collapsed' : 'open'}`}>
                <div className="sidebar-content">
                    <button onClick={() => handleNavigate('/')}>퀴즈 선택</button>
                    <button onClick={() => handleNavigate('/create')}>퀴즈 만들기</button>

                    {user ? (
                        <>
                            <p><strong>프로필</strong></p>
                            <p>닉네임: {nickname || '로딩 중...'}</p>
                            <button onClick={handleLogout}>로그아웃</button>
                        </>
                    ) : (
                        <>
                            <p><strong>로그인이 필요합니다</strong></p>
                            <button onClick={() => handleNavigate('/login')}>로그인</button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}
