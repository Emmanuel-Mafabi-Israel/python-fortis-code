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
        <div className="fortis-code-welcome-page">
            <div className='fortis-code-org'>
                <div className='fortis-code-logo'>Fortis<b className='gray'>Code</b></div>
                <div className='fortis-code-subheading'>cryptofortis by Israel Mafabi Emmanuel</div>
            </div>
            <p className='fortis-code-setup-text'>Start Your Secure Digital Journey</p>
            <div className="fortis-code-welcome-buttons">
                <Link to="/register">
                    <Button className='fortis-code-btn-initiators'>Get Started</Button>
                </Link>
                <Link to="/login" className='fortis-code-link-initiators'>
                    Already a Fortis<b>Code</b> User? Sign in
                </Link>
            </div>
        </div>
    );
};