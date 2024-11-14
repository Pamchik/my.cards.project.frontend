import SpoilerArrowBlock from "../../UI/spoilers/SpoilerArrowBlock"
import MainInfoBlock from "../../blocks/MainInfoBlock"

interface IElementSpoiler {
    spoilerTitle: string
    children?: React.ReactNode
    infoWindowTitle?: string
    infoWindowColor?: string
    infoWindowDate?: string
    isDefaultActive?: boolean
    myStyleMain?: Record<string, string>
    isSpoilerDisabled?: boolean
}

const ElementSpoiler = ({
    spoilerTitle,
    infoWindowTitle,
    infoWindowColor,
    infoWindowDate,
    children,
    isDefaultActive,
    myStyleMain,
    isSpoilerDisabled
}: IElementSpoiler) => {

    return (
        <SpoilerArrowBlock 
            title={spoilerTitle} 
            infoWindowTitle={infoWindowTitle} 
            infoWindowColor={infoWindowColor} 
            infoWindowDate={infoWindowDate} 
            isDefaultActive={isDefaultActive}
            isSpoilerDisabled={isSpoilerDisabled}
        >
            <MainInfoBlock myStyleMain={{borderTop: '1px solid #bebebe', borderBottom: '1px solid #bebebe', minHeight: '200px', maxHeight: '700px', ...myStyleMain}}>
                {children}
            </MainInfoBlock>
        </SpoilerArrowBlock>
    );   
};


export default ElementSpoiler;        