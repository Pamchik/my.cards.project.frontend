import { IProcessNamesData } from '../../../../../../store/api/processNamesApiSlice';
import MainInfoBlock from '../../../../../blocks/MainInfoBlock';
import ElementSpoiler from '../../../../../UI/spoilers/ElementSpoiler';
import ProcessTableBlock from '../ProcessTableBlock';
import StatusCommentBlock from '../StatusCommentBlock';
import ProductionData from './ProductionData';


interface IStepComponent {
    selectedID: number
    processStep: IProcessNamesData
}

const Production = ({
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
                <ProductionData
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

export default Production;