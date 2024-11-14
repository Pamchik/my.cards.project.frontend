import { IProcessNamesData } from '../../../../../../store/api/processNamesApiSlice';
import MainInfoBlock from '../../../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../../../UI/spoilers/ElementSpoiler';
import ProcessTableBlock from '../ProcessTableBlock';
import StatusCommentBlock from '../StatusCommentBlock';
import POConditions from './POConditions';


interface IStepComponent {
    selectedID: number
    processStep: IProcessNamesData
}

const PO = ({
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
            <ElementSpoiler spoilerTitle={'Дополнительные условия'} myStyleMain={{}} isSpoilerDisabled={true}>
                <POConditions
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

export default PO;