/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- SHARED COMPONENT: BUTTON ---
*/

import React from 'react';

export default function Button({ onClick, children, type, className, disabled }) {
    return (
        <button
            onClick={onClick}
            type={type}
            className={className}
            disabled={disabled}>
            {children}
        </button>
    )
};