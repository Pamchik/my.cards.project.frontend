import { useState } from "react";


interface ISpoilerNumCycle {
    spoilerTitle: string
    spoilerNumber?: number
    stepStatus?: string
    myStyle?: Record<string, string>
    children?: React.ReactNode
    isDefaultActive?: boolean
}



const SpoilerNumCycle = ({
    children,
    spoilerTitle,
    myStyle,
    isDefaultActive,
    spoilerNumber,
    stepStatus
}: ISpoilerNumCycle) => {

    const [isActive, setIsActive] = useState<boolean>(isDefaultActive || false)

    const matchStatus: Record<string, string> = {
        'Not-started': '',
        'In-progress': 'progress',
        'Completed': 'completed',

    }
    const resultStatus = stepStatus ? matchStatus[stepStatus] : ''
    const fieldStatus = `spoiler-num-cycle__item_${resultStatus}`
    
    return (
            <div className={`spoiler-num-cycle__item ${fieldStatus}`}>
                <div 
                    className={`spoiler-num-cycle__title`}
                    class-name={spoilerNumber}
                    onClick={() => setIsActive(!isActive)}
                >
                    <div className="spoiler-num-cycle__text">{spoilerTitle}</div>
                </div>
                <div className="spoiler-num-cycle__block" style={{...myStyle, display: isActive ? 'block' : ''}} 
                >
                    <div className="spoiler-num-cycle__block-content">
                        {children}
                    </div>
                </div>
            </div>
    );
};

export default SpoilerNumCycle;








