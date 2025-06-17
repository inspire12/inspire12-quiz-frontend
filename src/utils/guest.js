// src/utils/guest.js
import { v4 as uuidv4 } from 'uuid';

export function getGuestId() {
    let id = localStorage.getItem('guestId');
    if (!id) {
        id = uuidv4();
        localStorage.setItem('guestId', id);
    }
    return id;
}
