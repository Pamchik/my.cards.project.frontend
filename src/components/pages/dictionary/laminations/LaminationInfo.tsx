import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../UI/spoilers/ElementSpoiler';
import LaminationsList from './LaminationsList';
import LaminationMainInfo from './LaminationMainInfo';


const LaminationInfo = () => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{flexDirection: 'row'}}>
            <LaminationsList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
            /> 
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', padding: '0 0 30px 0', marginLeft: '20px'}}>
                    <ElementSpoiler spoilerTitle={'Основная информация'}> 
                        <LaminationMainInfo
                            selectedID={selectedID}
                        />    
                    </ElementSpoiler> 
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default LaminationInfo;