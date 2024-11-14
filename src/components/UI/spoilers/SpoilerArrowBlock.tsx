import { useState } from "react";
import moment from "moment";

interface ISpoilerArrowBlock {
    title: string
    myStyle?: Record<string, string>
    children?: React.ReactNode
    infoWindowTitle?: string
    infoWindowColor?: string
    infoWindowDate?: string
    isDefaultActive?: boolean
    isSpoilerDisabled?: boolean
}

const SpoilerArrowBlock = ({
    children,
    title,
    myStyle,
    infoWindowTitle,
    infoWindowColor,
    infoWindowDate,
    isDefaultActive,
    isSpoilerDisabled
}: ISpoilerArrowBlock) => {

    const [isActive, setIsActive] = useState<boolean>(isDefaultActive || false)

    const fieldStatus = infoWindowTitle ? <div className="spoiler-arrow__field" style={{background: infoWindowColor}}>{infoWindowTitle}</div> : ''
    
    const fieldStatusDate = infoWindowDate ? <div className="spoiler-arrow__field">{moment.utc(infoWindowDate).format('DD.MM.YYYY')}</div> : ''

    // const fieldStatusDate = infoWindowTitle==='Завершено' && infoWindowDate ? <div className="spoiler-arrow__field">{moment.utc(infoWindowDate).format('DD.MM.YYYY')}</div> : ''

    return (
            <div className="spoiler-arrow__item">
                {isSpoilerDisabled 
                ?   
                    <div className="spoiler-arrow__text" style={{paddingLeft: '10px'}}>{title}</div>
                :
                    <div className={`spoiler-arrow__title ${isActive ? 'active' : ''}`}
                        onClick={() => setIsActive(!isActive)}
                    >
                        <div className="spoiler-arrow__text">{title}</div>
                        {fieldStatus}
                        {fieldStatusDate}
                    </div>
                }

                <div className="spoiler-arrow__block" style={{...myStyle, display: isActive || isSpoilerDisabled ? 'block' : ''}} 
                >
                    <div className="spoiler-arrow__block-content">
                        {children}
                    </div>
                </div>
            </div>
    );
};

export default SpoilerArrowBlock;








