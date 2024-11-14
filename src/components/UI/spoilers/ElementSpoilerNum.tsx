import MainInfoBlock from "../../blocks/MainInfoBlock"
import SpoilerNumCycle from "./SpoilerNumCycle"

interface ElementSpoilerNumType {
    spoilerTitle: string
    spoilerNumber?: number
    stepStatus?: string
    children?: React.ReactNode
    isDefaultActive?: boolean
    myStyleMain?: Record<string, string>
}

const ElementSpoilerNum = ({
    spoilerTitle,
    spoilerNumber,
    children,
    isDefaultActive,
    stepStatus,
    myStyleMain
}: ElementSpoilerNumType) => {

    return (
        <SpoilerNumCycle 
            spoilerTitle={spoilerTitle} 
            isDefaultActive={isDefaultActive} 
            spoilerNumber={spoilerNumber}
            stepStatus={stepStatus}
        >
            <MainInfoBlock 
                myStyleMain={{overflowY: 'hidden', border: '1px solid #989898',  ...myStyleMain}}
                myStyleContext={{minHeight: '200px', overflowY: 'auto'}}
            >
                {children}
            </MainInfoBlock>
        </SpoilerNumCycle>
    );   
};


export default ElementSpoilerNum;        