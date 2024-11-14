import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import BankBIDsList from './BankBIDsList';
import BankBIDMainInfo from './BankBIDMainInfo';

interface IBankBIDInfo {
    globalElementID: number
}

const BankBIDInfo = ({
    globalElementID
}: IBankBIDInfo) => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{}} myStyleContext={{flexDirection: 'row'}}>
            <BankBIDsList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
                globalElementID={globalElementID}
            />
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', marginLeft: '20px'}}>
                    <BankBIDMainInfo
                        selectedID={selectedID}      
                    />    
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default BankBIDInfo;