import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import VendorEmployeesList from './VendorEmployeesList';
import VendorEmployeeMainInfo from './VendorEmployeeMainInfo';


interface IVendorEmployeeInfo {
    globalElementID: number
}

const VendorEmployeeInfo = ({
    globalElementID
}: IVendorEmployeeInfo) => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{}} myStyleContext={{flexDirection: 'row'}}>
            <VendorEmployeesList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
                globalElementID={globalElementID}
            />
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', marginLeft: '20px'}}>
                    <VendorEmployeeMainInfo
                        selectedID={selectedID}      
                    />    
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default VendorEmployeeInfo;