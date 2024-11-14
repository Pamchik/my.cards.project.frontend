import React, { useEffect } from 'react';
import { useLocation  } from 'react-router-dom';
import SideNavLink from './SideNavLink';
import packageJson from '../../../../package.json'


interface ISidebar {
    setActiveLink: (index: string) => void
    activeLink: string
    arrLinks?: ILinks[]
}
export interface ILinks {
    firstLevel: {
        title: string,
        linkName?: string
        secondLevel?: {
            title: string,
            linkName?: string
        }[]
    }
}

const Sidebar = ({
    setActiveLink,
    activeLink,
    arrLinks
}: ISidebar) => {

    // Настройка текущего URL если было введено вручную
        const location = useLocation();
        useEffect(() => {
            const currentUrl = `/${location.pathname.split("/")[1]}/`
            setActiveLink(currentUrl);
        }, [location.pathname]);

    // Версия приложения
        const version = packageJson.version;

  return (
    
    <div className="sidenav">
        <div className="sidenav__logo">
            <h2 className="sidenav__title">IBS PROJECT</h2>
        </div>
        <div className="sidenav__link">

            {arrLinks && arrLinks.map((item) => (
                <SideNavLink
                    key={item.firstLevel.title}
                    item={item}
                    activeLink={activeLink}
                />
            ))}

        </div>
        <div className="sidenav__version">
            <h2 className="sidenav__title">Version: {version}</h2>
        </div>
    </div>

  );
}

export default Sidebar;
