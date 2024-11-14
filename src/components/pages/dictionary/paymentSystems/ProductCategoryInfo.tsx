import React, { useState } from 'react';
import MainInfoBlock from '../../../blocks/MainInfoBlock';
import ProductCategoriesList from './ProductCategoriesList';
import ProductCategoryMainInfo from './ProductCategoryMainInfo';

interface IProductCategoryInfo {
    globalElementID: number
}

const ProductCategoryInfo = ({
    globalElementID
}: IProductCategoryInfo) => {

    const [selectedID, setSelectedID] = useState<number | null>(null)

    return (
        <MainInfoBlock myStyleMain={{}} myStyleContext={{flexDirection: 'row'}}>
            <ProductCategoriesList
                setSelectedID={setSelectedID}
                selectedID={selectedID}
                globalElementID={globalElementID}
            />
            {selectedID &&
                <MainInfoBlock myStyleMain={{borderLeft: '1px solid #bebebe', marginLeft: '20px'}}>
                    <ProductCategoryMainInfo
                        selectedID={selectedID}      
                    />    
                </MainInfoBlock>
            }
        </MainInfoBlock>
    );
};

export default ProductCategoryInfo;