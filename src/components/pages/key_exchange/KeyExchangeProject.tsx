import { useParams } from 'react-router-dom';
import KeyExchangeProjectTopInfo from './KeyExchangeProjectTopInfo';
import KeyExchangeProjectBottomBlock from './KeyExchangeProjectBottomBlock';

const KeyExchangeProject = () => {

    const { selectedID } = useParams<string>();

    return (
        <div style={{width: '100%'}}>
            {selectedID && 
            <>
                {/* -------- Верхняя панель с информацией по карте -------- */}
                <KeyExchangeProjectTopInfo
                    selectedID={+selectedID}
                />
                
                {/* -------- Нижняя панель с данными по карте -------- */}
                <KeyExchangeProjectBottomBlock
                    selectedID={+selectedID}   
                />
            </>
            }
        </div>
    );
};

export default KeyExchangeProject;