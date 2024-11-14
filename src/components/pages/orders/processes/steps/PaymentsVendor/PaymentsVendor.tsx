import { IProcessNamesData } from '../../../../../../store/api/processNamesApiSlice';
import MainInfoBlock from '../../../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../../../UI/spoilers/ElementSpoiler';
import ProcessTableBlock from '../ProcessTableBlock';
import StatusCommentBlock from '../StatusCommentBlock';
import PaymentsInfoTableBlock from './PaymentsInfoTableBlock';
import VendorPriceInfo from './VendorPriceInfo';


interface IStepComponent {
    selectedID: number
    processStep: IProcessNamesData
}

const PaymentsVendor = ({
    selectedID,
    processStep
}: IStepComponent) => {

    return (
        <>
            <MainInfoBlock myStyleMain={{flex: '0 0 auto', borderBottom: '1px solid #bebebe'}}>
                <StatusCommentBlock
                    selectedID={selectedID}
                    processStep={processStep.id}
                />
            </MainInfoBlock>
            <ElementSpoiler spoilerTitle={'Данные по оплате (Вендор)'} myStyleMain={{}} isSpoilerDisabled={true}>
                <VendorPriceInfo
                    selectedID={selectedID}
                />
                <MainInfoBlock myStyleMain={{borderTop: '1px solid #bebebe'}}>
                    <PaymentsInfoTableBlock
                        selectedID={selectedID}
                        companyType={'vendor'}
                    />
                </MainInfoBlock>
            </ElementSpoiler>
            <ElementSpoiler spoilerTitle={'Документы'} myStyleMain={{}} isSpoilerDisabled={true}>
                <ProcessTableBlock
                    selectedID={selectedID}
                    processStep={processStep}
                />
            </ElementSpoiler>
        </>
    );
};

export default PaymentsVendor;