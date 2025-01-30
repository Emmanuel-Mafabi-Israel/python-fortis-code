/*
    GLORY BE TO GOD,
    FORTIS-CODE,
    BY ISRAEL MAFABI EMMANUEL

    --- ACCOUNT DELETION CONFIRMATION PAGE ---
*/

import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/FortisButton';

export default function AccountDeleted() {
    return (
        <div className="fortis-code-account-deleted-page">
            <div className='fortis-code-org'>
                <div className='fortis-code-logo'>Account Deleted Successfully</div>
                <div className='fortis-code-subheading'>Your Fortis<b>Code</b>&nbsp;Account and all its data have been deleted.</div>
            </div>
            <div className="fortis-code-account-deleted-actions">
                <Link to="/">
                    <Button>Go to Welcome Page</Button>
                </Link>
                <Link to="/register">
                    <Button>Register</Button>
                </Link>
            </div>
        </div>
    );
};