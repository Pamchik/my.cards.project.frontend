import { useParams } from 'react-router-dom';
import LineDetailTopInfo from './LineDetailTopInfo';
import LineDetailBottomBlock from './LineDetailBottomBlock';
import { useState } from 'react';

const LineDetail = () => {

    // Получение данных исходя из id
        const { selectedID } = useParams<string>();

    const [selectedTab, setSelectedTab] = useState<number>(0)
    function funcCallBackSelectTab (num: number) {
        setSelectedTab(num)
    }

    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            {selectedID && 
            <>
                {/* -------- Верхняя панель с информацией по карте -------- */}
                <LineDetailTopInfo
                    selectedID={+selectedID}
                    selectedTab={selectedTab}
                />
                
                {/* -------- Нижняя панель с данными по карте -------- */}
                <LineDetailBottomBlock
                    selectedID={+selectedID}
                    funcSelectTab={(num: number) => funcCallBackSelectTab(num)}
                />
            </>
            }
        </div>
    )
}
export default LineDetail