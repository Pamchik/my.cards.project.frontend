import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import MaterialColorMainInfo from './MaterialColorMainInfo';
import MaterialColorsList from './MaterialColorsList';

interface IMaterialColorInfo {
    globalElementID: number
}

const MaterialColorInfo = ({
    globalElementID
}: IMaterialColorInfo) => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{}} myStyleContext={{flexDirection: 'row'}}>
            <MaterialColorsList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
                globalElementID={globalElementID}
            />
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', marginLeft: '20px'}}>
                    <MaterialColorMainInfo
                        selectedID={selectedID}      
                    />    
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default MaterialColorInfo;