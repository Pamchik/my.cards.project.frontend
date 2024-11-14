import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../UI/spoilers/ElementSpoiler';
import ProductTypesList from './ProductTypesList';
import ProductTypeMainInfo from './ProductTypeMainInfo';


const ProductTypeInfo = () => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{border: '1px solid #bebebe', borderRadius: '10px'}} myStyleContext={{flexDirection: 'row'}}>
            <ProductTypesList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
            /> 
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', padding: '0 0 30px 0', marginLeft: '20px'}}>
                    <ElementSpoiler spoilerTitle={'Основная информация'}> 
                        <ProductTypeMainInfo
                            selectedID={selectedID}
                        />    
                    </ElementSpoiler> 
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default ProductTypeInfo;