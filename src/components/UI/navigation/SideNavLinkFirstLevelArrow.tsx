import React from 'react';
import { Link } from 'react-router-dom';

interface ISideNavLinkFirstLevelArrow {
    activeLink: string
    onClickFirstLevel: () => void
    title: string
    nameLink: string
    links: Record<string, string>[]
    index: number
    states: any
    // children?: React.ReactNode
}


const SideNavLinkFirstLevelArrow = ({
    activeLink,
    links,
    title,
    states,
    onClickFirstLevel,
    index
}: ISideNavLinkFirstLevelArrow) => {

    const checkLink = links.find(({linkName}) => linkName === activeLink)

    return (
        <div className={`sidenav__item ${checkLink ? 'active' : ''}`} key={title}>
            <div 
                className={`first-level first-level_arrow ${states[index].isActive 
                    ? 'active' 
                    : ''}`} 
                onClick={onClickFirstLevel}>
                <span className="first-level__text">{title}</span>
            </div>

            <div 
                className="second-level" 
                style={{ display: states[index].isExpanded 
                    ? 'block' 
                    : 'none' 
                }}
            >
                <div className="second-level__block">
                    {links.map(item => (
                        <Link 
                            to={{ 
                                pathname: item.linkName, 
                                // fromDashboard: false 
                            }} 
                            className={` ${activeLink === item.linkName 
                                ? 'active' 
                                : ''
                            }`}
                            key={item.title}
                        >
                        <span className="second-level__text" >{item.title}</span>
                    </Link> 
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SideNavLinkFirstLevelArrow;