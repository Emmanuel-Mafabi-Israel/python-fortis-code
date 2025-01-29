/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- SHARED COMPONENT: ERROR MESSAGE ---
*/

import React from 'react'

export default function ErrorMessage({ message }) {
    return (
        <div className='fortis-message error' style={{ color: "red" }}>{message}</div>
    )
}