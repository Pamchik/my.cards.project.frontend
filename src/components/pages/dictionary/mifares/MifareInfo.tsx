import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../UI/spoilers/ElementSpoiler';
import MifaresList from './MifaresList';
import MifareMainInfo from './MifareMainInfo';


const MifareInfo = () => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{flexDirection: 'row'}}>
            <MifaresList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
            /> 
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', padding: '0 0 30px 0', marginLeft: '20px'}}>
                    <ElementSpoiler spoilerTitle={'Основная информация'}> 
                        <MifareMainInfo
                            selectedID={selectedID}
                        />    
                    </ElementSpoiler>
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default MifareInfo;