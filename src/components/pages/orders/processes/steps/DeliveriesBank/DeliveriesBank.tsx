import { IProcessNamesData } from '../../../../../../store/api/processNamesApiSlice';
import MainInfoBlock from '../../../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../../../UI/spoilers/ElementSpoiler';
import ProcessTableBlock from '../ProcessTableBlock';
import StatusCommentBlock from '../StatusCommentBlock';
import DeliveriesInfoTableBlock from './DeliveriesInfoTableBlock';
import DeliveryToBankInfo from './DeliveryToBankInfo';


interface IStepComponent {
    selectedID: number
    processStep: IProcessNamesData
}

const DeliveriesBank = ({
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
            <ElementSpoiler spoilerTitle={'Информация'} myStyleMain={{}} isSpoilerDisabled={true}>
                <DeliveryToBankInfo
                    selectedID={selectedID}
                />
                <MainInfoBlock myStyleMain={{borderTop: '1px solid #bebebe'}}>
                    <DeliveriesInfoTableBlock
                        selectedID={selectedID}
                        companyType={'bank'}
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

export default DeliveriesBank;