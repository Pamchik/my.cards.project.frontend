import { useParams } from "react-router-dom";
import CardsTestingProjectTopInfo from "./CardsTestingProjectTopInfo";
import CardsTestingProjectBottomBlock from "./CardsTestingProjectBottomBlock";


const CardsTestingProject = () => {

    const { selectedID } = useParams<string>();


    return (
        <div style={{width: '100%'}}>
            {selectedID && 
            <>
                {/* -------- Верхняя панель с информацией по карте -------- */}
                <CardsTestingProjectTopInfo
                    selectedID={+selectedID} 
                />
                
                {/* -------- Нижняя панель с данными по карте -------- */}
                <CardsTestingProjectBottomBlock
                    selectedID={+selectedID}   
                />
            </>
            }
        </div>
    );
};

export default CardsTestingProject;