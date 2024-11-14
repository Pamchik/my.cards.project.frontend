import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../UI/spoilers/ElementSpoiler';
import EffectsList from './EffectsList';
import EffectMainInfo from './EffectMainInfo';
import EffectMatching from './EffectMatching';


const EffectInfo = () => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{flexDirection: 'row'}}>
            <EffectsList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
            /> 
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', padding: '0 0 30px 0', marginLeft: '20px'}}>
                    <ElementSpoiler spoilerTitle={'Основная информация'}> 
                        <EffectMainInfo
                            selectedID={selectedID}
                        />    
                    </ElementSpoiler>
                    <ElementSpoiler spoilerTitle={'Соответветствие эффектов'}> 
                        <EffectMatching
                            globalElementID={selectedID} 
                        />    
                    </ElementSpoiler> 
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default EffectInfo;