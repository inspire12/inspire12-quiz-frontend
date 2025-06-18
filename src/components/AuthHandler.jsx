// src/components/AuthHandler.jsx
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import supabase from '../api/supabaseClient'
import {getCurrentUserId} from "../utils/auth.js";

export default function AuthHandler() {
    const navigate = useNavigate()
    useEffect(() => {
        const migrateGuestData = async (userId) => {
            const creator = await getCurrentUserId()
            // guest_id 로 만들어둔 퀴즈북 전부 내 계정(user_id)으로 바꿔주기
            await supabase
                .from('quiz_books')
                .update({user_id: userId})
                .eq('user_id', creator);
        };

        const checkAndMigrate = async () => {
            const {data: {user}} = await supabase.auth.getUser();
            if (user) {
                await migrateGuestData(user.id);
                // 더 이상 guestId 필요 없으면 localStorage에서 제거
                localStorage.removeItem('guestId');
            }
        };

        const {data: listener} = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                checkAndMigrate();
            }
        });
        // 페이지 로드 시 이미 로그인 상태면 즉시 마이그레이션
        checkAndMigrate().then(r => console.log(r));

        return () => listener.subscription.unsubscribe();
    }, []);

    useEffect(() => {


        const checkAndRedirect = async () => {
            const {data: {user}} = await supabase.auth.getUser()
            if (!user) return

            const {data: existing} = await supabase
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

        const {data: listener} = supabase.auth.onAuthStateChange((event, session) => {
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