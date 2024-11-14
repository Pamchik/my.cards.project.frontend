import { IProcessNamesData } from '../../../../../../store/api/processNamesApiSlice';
import MainInfoBlock from '../../../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../../../UI/spoilers/ElementSpoiler';
import ProcessTableBlock from '../ProcessTableBlock';
import StatusCommentBlock from '../StatusCommentBlock';
import PaymentSystemData from './PaymentSystemData';


interface IStepComponent {
    selectedID: number
    processStep: IProcessNamesData
}

const PaymentSystem = ({
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
            <ElementSpoiler spoilerTitle={'Общие данные'} myStyleMain={{}} isSpoilerDisabled={true}>
                <PaymentSystemData
                    selectedID={selectedID}
                />
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

export default PaymentSystem;