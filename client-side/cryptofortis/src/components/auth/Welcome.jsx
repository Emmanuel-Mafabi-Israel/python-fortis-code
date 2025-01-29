/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- WELCOMING SCREEN ---
*/

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/FortisButton';

export default function Welcome() {
    return (
        <div className="fortis-welcome-page">
            <div className='fortis-org'>
                <h1 className='fortis-logo'>Fortis<b>Code</b></h1>
                <div className='fortis-org-info'>cryptofortis by Israel Mafabi Emmanuel</div>
            </div>
            <p className='fortis-setup-text'>Secure Your Digital Assets Today</p>
            <div className="fortis-welcome-buttons">
                <Link to="/register">
                    <Button>Get Started</Button>
                </Link>
                <Link to="/login">
                    <Button>Login</Button>
                </Link>
            </div>
        </div>
    );
};