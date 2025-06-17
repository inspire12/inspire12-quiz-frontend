import React, {useEffect} from 'react';
import {useNavigate} from 'react-router-dom'; // React Router 사용 시
import supabase from '../api/supabaseClient'; // 기존 Supabase 클라이언트 import

const SigninPage = () => {
    const navigate = useNavigate();

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin, // 로그인 성공 후 리다이렉트될 URL
            },
        });
    };

    useEffect(() => {
        const checkUser = async () => {
            const {data: {user}} = await supabase.auth.getUser()
            if (!user) return

            const {data: existing} = await supabase
                .from('users')
                .select('id')
                .eq('id', user.id)
                .single()

            navigate(existing ? '/' : '/signup')
        }

        checkUser().then(r => console.log(r))
    }, [])

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            // minHeight: '100vh',
            padding: '2rem',              // 화면 중앙에서 약간 떨어진 위치에 카드 배치
            backgroundColor: 'rgb(240, 242, 245)',
            fontFamily: 'Arial, sans-serif'
        }}>
            <div style={{
                backgroundColor: '#ffffff',
                padding: '40px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                width: '350px',
                maxWidth: '90%',
                boxSizing: 'border-box'
            }}>
                <h2 style={{
                    marginBottom: '30px',
                    color: '#333',
                    fontSize: '24px'
                }}>로그인</h2>
                <button
                    onClick={handleGoogleLogin}
                    style={{
                        backgroundColor: '#4285F4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '12px 25px',
                        fontSize: '16px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        transition: 'background-color 0.3s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#357ae8'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#4285F4'}
                >
                    <img
                        src="https://img.icons8.com/color/24/000000/google-logo.png"
                        alt="Google logo"
                        style={{marginRight: '10px'}}
                    />
                    Google로 로그인
                </button>
            </div>
        </div>
    );
};

export default SigninPage;