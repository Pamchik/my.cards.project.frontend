import React from 'react';
import UserDropButton from '../../users/UserDropButton';

const Topnav = () => {

    return (
        <div className="navbar">
            <div className="navbar__row">
                <div className="navbar__block-btn" >
                    
                </div>
                <div className="navbar__user">
                    <UserDropButton></UserDropButton>
                </div>
            </div>
        </div>
    );
}

export default Topnav;
