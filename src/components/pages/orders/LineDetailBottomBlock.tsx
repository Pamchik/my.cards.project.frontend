import React, { useState } from 'react';
import TabBlock from '../../UI/tabs/TabBlock';
import GeneralLineInfo from './generalTab/GeneralLineInfo';
import ListSteps from './processes/ListSteps';
import ProjectGallery from './gallery/ProjectMainData';

interface ILineDetailBottomBlock {
    selectedID: number,
    funcSelectTab: (num: number) => void;
}

const LineDetailBottomBlock = ({
    selectedID,
    funcSelectTab
}: ILineDetailBottomBlock) => {

    const navigationMap: Record<string, React.ComponentType<any>> = {
        'Общее': GeneralLineInfo,
        'Процессы': ListSteps,
        'Галерея': ProjectGallery,
    };

    const navigationArray: React.ComponentType<any>[] = Object.values(navigationMap);

    const [activeTab, setActiveTab] = useState<number>(0);
    const ActiveComponent = navigationArray[activeTab];


     
    return (
        <div style={{width: '100%', height: 'calc(100% - 50px)', display: 'flex', flexDirection: 'column'}}>
            <div className="top-info-block">
                <div className="top-info-block__fields" style={{width: '100%'}}>
                    <TabBlock
                        items={Object.keys(navigationMap)}
                        selectedItem={activeTab}
                        onIndexChange={(index) => {
                            setActiveTab(index)
                            funcSelectTab(index)
                        }}
                        btnDisabled={true}
                    />
                </div>
            </div>
            <div className='bottom-context-block'>
                <ActiveComponent selectedID={selectedID}/>
            </div>
        </div>
    );
};

export default LineDetailBottomBlock;