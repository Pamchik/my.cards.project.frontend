import React from 'react';
import { Link } from 'react-router-dom';

interface ISideNavLinkFirstLevel {
    activeLink: string
    onClick: () => void
    title: string
    nameLink: string
    children?: React.ReactNode
}

const SideNavLinkFirstLevel = ({
    activeLink,
    onClick,
    title,
    nameLink
}: ISideNavLinkFirstLevel) => {

    return (
        <div
            key={title}
            className={`sidenav__item ${activeLink.startsWith(`/${nameLink}/`) 
                ? 'active' 
                : ''}`}
            onClick={onClick}
            
        >
            <Link to={{ pathname: `/${nameLink}/` }}>
                <div className="first-level">
                    <span className="first-level__text">{title}</span>
                </div>
            </Link>
        </div>
    );
};

export default SideNavLinkFirstLevel;