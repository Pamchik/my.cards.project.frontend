import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import ChipsList from './ChipsList';
import ChipMainInfo from './ChipMainInfo';
import ElementSpoiler from '../../../UI/spoilers/ElementSpoiler';
import MifareMatchingMainInfo from './MifareMatchingMainInfo';
import AppletMatchingMainInfo from './AppletMatchingMainInfo';


const ChipInfo = () => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{flexDirection: 'row'}}>
            <ChipsList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
            /> 
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', padding: '0 0 30px 0', marginLeft: '20px'}}>
                    <ElementSpoiler spoilerTitle={'Основная информация'}> 
                        <ChipMainInfo
                            selectedID={selectedID}
                        />    
                    </ElementSpoiler>
                    <ElementSpoiler spoilerTitle={'Поддержка Applet'}>
                        <AppletMatchingMainInfo
                            selectedID={selectedID}
                        />
                    </ElementSpoiler> 
                    <ElementSpoiler spoilerTitle={'Поддержка Mifare'}>
                        <MifareMatchingMainInfo
                            selectedID={selectedID}
                        />
                    </ElementSpoiler> 
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default ChipInfo;