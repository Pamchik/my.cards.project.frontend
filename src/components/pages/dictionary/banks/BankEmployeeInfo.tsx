import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import BankEmployeesList from './BankEmployeesList';
import BankEmployeeMainInfo from './BankEmployeeMainInfo';


interface IBankEmployeeInfo {
    globalElementID: number
}

const BankEmployeeInfo = ({
    globalElementID
}: IBankEmployeeInfo) => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{}} myStyleContext={{flexDirection: 'row'}}>
            <BankEmployeesList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
                globalElementID={globalElementID}
            />
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', marginLeft: '20px'}}>
                    <BankEmployeeMainInfo
                        selectedID={selectedID}      
                    />    
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default BankEmployeeInfo;