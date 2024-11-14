import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../UI/spoilers/ElementSpoiler';
import MaterialsList from './MaterialsList';
import MaterialMainInfo from './MaterialMainInfo';
import MaterialColorInfo from './MaterialColorInfo';


const MaterialInfo = () => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{flexDirection: 'row'}}>
            <MaterialsList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
            /> 
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', padding: '0 0 30px 0', marginLeft: '20px'}}>
                    <ElementSpoiler spoilerTitle={'Основная информация'}> 
                        <MaterialMainInfo
                            selectedID={selectedID}
                        />    
                    </ElementSpoiler>
                    <ElementSpoiler spoilerTitle={'Цвет материала'}>
                        <MaterialColorInfo
                            globalElementID={selectedID}
                        />
                    </ElementSpoiler> 
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default MaterialInfo;