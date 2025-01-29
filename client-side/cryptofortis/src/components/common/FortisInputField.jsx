/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- SHARED COMPONENT: INPUT FIELD ---
*/

import React from 'react';

export default function InputField({ className, placeholder, type, value, onChange, required }) {
    return (
        <input
            className={className}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            placeholder={placeholder}
        />
    )
}