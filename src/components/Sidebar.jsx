import React, {useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import supabase from '../api/supabaseClient'
import QuizImportBox from "./QuizImportBox.jsx";

export default function Sidebar() {
    const [collapsed, setCollapsed] = useState(true) // 기본 닫힘
    const [user, setUser] = useState(null)
    const [nickname, setNickname] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const fetchUserInfo = async () => {
            const {data: {user}} = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                const {data: existingUser} = await supabase
                    .from('users')
                    .select('nickname')
                    .eq('id', user.id)
                    .single()

                if (existingUser?.nickname) {
                    setNickname(existingUser.nickname)
                } else {
                    navigate('/signup') // 가입 정보가 없으면 이동
                }
            } else {
                setNickname('')
            }
        }

        // 최초 한 번 실행
        fetchUserInfo()

        // 로그인 상태 변경 감지
        const {data: authListener} = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null)
            fetchUserInfo()
        })

        return () => {
            authListener.subscription.unsubscribe()
        }
    }, [])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        setUser(null)
        navigate('/create')
    }

    const handleLogin = () => {
        navigate('/login')
    }

    const handleNavigate = (path) => {
        navigate(path)
    }

    return (
        <div style={{
            width: collapsed ? '60px' : '200px',
            transition: 'width 0.3s',
            backgroundColor: '#1e293b',
            color: '#fff',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            padding: '1rem',
            boxSizing: 'border-box',
            zIndex: 999,
        }}>
            <button onClick={() => setCollapsed(!collapsed)} title={collapsed ? '사이드바 열기' : '사이드바 닫기'}>
                {collapsed ? '▶' : '◀'}
            </button>

            {!collapsed && (
                <div style={{marginTop: '1rem'}}>
                    <button onClick={() => handleNavigate('/')} style={{
                        display: 'block',
                        marginBottom: '0.5rem',
                        background: '#3b82f6',
                        color: '#fff',
                        padding: '0.4rem',
                        borderRadius: '4px',
                        border: 'none',
                        width: '100%'
                    }}>퀴즈 선택
                    </button>
                    <button onClick={() => handleNavigate('/create')} style={{
                        display: 'block',
                        marginBottom: '1rem',
                        background: '#10b981',
                        color: '#fff',
                        padding: '0.4rem',
                        borderRadius: '4px',
                        border: 'none',
                        width: '100%'
                    }}>퀴즈 만들기
                    </button>

                    {user ? (
                        <>
                            <p><strong>프로필</strong></p>
                            <p>닉네임: {nickname || '로딩 중...'}</p>
                            <button
                                onClick={handleLogout}
                                style={{
                                    marginTop: '1rem',
                                    background: '#ef4444',
                                    padding: '0.4rem 0.8rem',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}
                            >로그아웃
                            </button>
                        </>
                    ) : (
                        <>
                            <p><strong>로그인이 필요합니다</strong></p>
                            <button
                                onClick={handleLogin}
                                style={{
                                    marginTop: '1rem',
                                    background: '#3b82f6',
                                    padding: '0.4rem 0.8rem',
                                    border: 'none',
                                    borderRadius: '4px',
                                    color: '#fff',
                                    cursor: 'pointer'
                                }}
                            >로그인
                            </button>
                        </>
                    )}
                </div>

            )}
        </div>
    )
}