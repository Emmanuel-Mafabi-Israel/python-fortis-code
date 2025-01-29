/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- SHARED COMPONENT: INPUT FIELD ---
*/

import React from 'react';

export default function InputField({ label, type, value, onChange, required }) {
    return (
        <div>
            <label>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
            />
        </div>
    )
}