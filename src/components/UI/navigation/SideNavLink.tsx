import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ILinks } from './Sidenav';

interface ISideNavLink {
    item: ILinks
    activeLink: string
}

interface IFirstLevelStates {
    isActive: boolean
    isExpanded: boolean
}

interface ISecondLevelStates {
    [linkName: string]: boolean
}

const firstLevelStatesModel: IFirstLevelStates = {
    isActive: false, 
    isExpanded: false
}



const SideNavLink = ({ 
    item,
    activeLink,
}: ISideNavLink) => {

    // Настройка отображения в зависимости от дерева
        const [numberLevels, setNumberLevels] = useState<number>(1)
        useEffect(() => {
            if (item) {
                if (item.firstLevel.secondLevel) {
                    if (item.firstLevel.secondLevel.length > 0) {
                        setNumberLevels(2)
                    }
                }
            }    
        },[item])


    // Настройка отображения цветом и открытия в зависимости от текущего url
        const [firstLevelStates, setFirstLevelStates] = useState<IFirstLevelStates>(firstLevelStatesModel)
        const [secondLevelStates, setSecondLevelStates] = useState<ISecondLevelStates>({})

        useEffect(() => {
            if (activeLink) {
                setFirstLevelStates((prevData) => ({
                    ...prevData,
                    isActive: false,
                }))
                if (numberLevels === 1) {
                    if (item.firstLevel.linkName === activeLink) {
                        setFirstLevelStates((prevData) => ({
                            ...prevData,
                            isActive: true,
                        }))
                    }
                } else if (numberLevels === 2) {

                    if (item.firstLevel.secondLevel) {
                        for (let i = 0; i < item.firstLevel.secondLevel.length; i++) {

                            const linkNameSecondLevel: string | undefined = item.firstLevel.secondLevel[i].linkName

                            if (linkNameSecondLevel === undefined) {

                            } else if (linkNameSecondLevel === activeLink) {
                                setFirstLevelStates((prevData) => ({
                                    ...prevData,
                                    isActive: true,
                                }))

                                setSecondLevelStates((prevData) => ({
                                    ...prevData,
                                    [linkNameSecondLevel]: true
                                }))
                            } else if (linkNameSecondLevel !== activeLink) {
                                setSecondLevelStates((prevData) => ({
                                    ...prevData,
                                    [linkNameSecondLevel]: false
                                }))
                            }
                        }
                    }
                }
            }
        },[activeLink, numberLevels])



    return (
        <div 
            key={item.firstLevel.title}
            className={`sidenav__item ${firstLevelStates.isActive ? 'active' : ''}`} 
        > 

            <Link to={{pathname: item.firstLevel.linkName}} >
                <div 
                    className={`first-level ${numberLevels > 1 
                        ? `first-level_arrow ${firstLevelStates.isExpanded === true ? 'active' : ''}` 
                        : ''
                    }`}  
                    onClick={() => setFirstLevelStates((prevData) => ({...prevData, isExpanded: !prevData.isExpanded}))}
                    >
                    <span className="first-level__text">{item.firstLevel.title}</span>
                </div>
            </Link>

            {numberLevels === 2 && 
                <div 
                    className="second-level" 
                    style={{ display: firstLevelStates.isExpanded
                        ? 'block' 
                        : 'none' 
                    }}
                >
                    <div className="second-level__block">
                        {item.firstLevel.secondLevel && item.firstLevel.secondLevel.map(item => (
                            <Link 
                                to={{pathname: item.linkName}} 
                                className={` ${item.linkName && secondLevelStates[item.linkName] 
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
            }
        </div>
    );
};

export default SideNavLink;