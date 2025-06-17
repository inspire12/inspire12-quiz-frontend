// src/utils/auth.js
import supabase from '../api/supabaseClient'
import { v4 as uuidv4 } from 'uuid';

export async function getGuestId() {
    let id = localStorage.getItem('guestId');
    if (!id) {
        id = uuidv4();
        localStorage.setItem('guestId', id);
    }
    return id;
}

export async function getCurrentUserId() {
    const {
        data: { user }
    } = await supabase.auth.getUser()
    return user?.id || getGuestId()
}
