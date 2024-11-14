import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../UI/spoilers/ElementSpoiler';
import PaymentSystemsList from './PaymentSystemsList';
import PaymentSystemMainInfo from './PaymentSystemMainInfo';
import ProductCategoryInfo from './ProductCategoryInfo';


const PaymentSystemInfo = () => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{flexDirection: 'row'}}>
            <PaymentSystemsList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
            /> 
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', padding: '0 0 30px 0', marginLeft: '20px'}}>
                    <ElementSpoiler spoilerTitle={'Основная информация'}> 
                        <PaymentSystemMainInfo
                            selectedID={selectedID}
                        />    
                    </ElementSpoiler>
                    <ElementSpoiler spoilerTitle={'Категории'}>
                        <ProductCategoryInfo
                            globalElementID={selectedID}
                        />
                    </ElementSpoiler> 
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default PaymentSystemInfo;