/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- SHARED COMPONENT: ERROR MESSAGE ---
*/

import React from 'react'

export default function ErrorMessage({ className, message }) {
    return (
        <div className={className}>{message}</div>
    )
}