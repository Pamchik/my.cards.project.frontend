import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import BanksList from './BanksList';
import BankMainInfo from './BankMainInfo';
import ElementSpoiler from '../../../UI/spoilers/ElementSpoiler';
import BankBIDInfo from './BankBIDInfo';
import BankEmployeeInfo from './BankEmployeeInfo';


const BankInfo = () => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{flexDirection: 'row'}}>
            <BanksList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
            /> 
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', padding: '0 0 30px 0', marginLeft: '20px'}}>
                    <ElementSpoiler spoilerTitle={'Основная информация'}> 
                        <BankMainInfo
                            selectedID={selectedID}
                        />    
                    </ElementSpoiler>   
                    <ElementSpoiler spoilerTitle={'Сотрудники Банка'}> 
                        <BankEmployeeInfo
                            globalElementID={selectedID}
                        />
                    </ElementSpoiler>
                    <ElementSpoiler spoilerTitle={'BID Банка'}> 
                        <BankBIDInfo
                            globalElementID={selectedID}
                        />
                    </ElementSpoiler>
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default BankInfo;