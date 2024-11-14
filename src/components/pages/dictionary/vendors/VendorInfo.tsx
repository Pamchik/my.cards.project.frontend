import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import VendorsList from './VendorsList';
import ElementSpoiler from '../../../UI/spoilers/ElementSpoiler';
import VendorMainInfo from './VendorMainInfo';
import VendorEmployeeInfo from './VendorEmployeeInfo';
import VendorManufactureInfo from './VendorManufactureInfo';


const VendorInfo = () => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{flexDirection: 'row'}}>
            <VendorsList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
            /> 
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', padding: '0 0 30px 0', marginLeft: '20px'}}>
                    <ElementSpoiler spoilerTitle={'Основная информация'}> 
                        <VendorMainInfo
                            selectedID={selectedID}
                        />    
                    </ElementSpoiler>   
                    <ElementSpoiler spoilerTitle={'Сотрудники Вендора'}> 
                        <VendorEmployeeInfo
                            globalElementID={selectedID}
                        />
                    </ElementSpoiler>
                    <ElementSpoiler spoilerTitle={'Производства'}> 
                        <VendorManufactureInfo
                            globalElementID={selectedID}
                        />
                    </ElementSpoiler>
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default VendorInfo;