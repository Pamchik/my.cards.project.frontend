import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import VendorManufacturiesList from './VendorManufacturiesList';
import VendorManufactureMainInfo from './VendorManufactureMainInfo';

interface IVendorManufactureInfo {
    globalElementID: number
}

const VendorManufactureInfo = ({
    globalElementID
}: IVendorManufactureInfo) => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{}} myStyleContext={{flexDirection: 'row'}}>
            <VendorManufacturiesList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
                globalElementID={globalElementID}
            />
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', marginLeft: '20px'}}>
                    <VendorManufactureMainInfo
                        selectedID={selectedID}      
                    />    
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default VendorManufactureInfo;