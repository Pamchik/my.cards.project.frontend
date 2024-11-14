import { Routes, Route, Navigate } from "react-router-dom";
import MainDictionaryWindow from "../pages/dictionary/MainDictionaryWindow";
import Profile from "../auth/Profile";
import GeneralOrdersPage from "../pages/orders/GeneralOrdersPage";
import DocTemplatesPage from "../pages/doc_templates/DocTemplatesPage";
import GeneralKeyExchangePage from "../pages/key_exchange/GeneralKeyExchangePage";
import GeneralCardsTestingPage from "../pages/cards_testing/GeneralCardsTestingPage";
import KeyExchangeProject from "../pages/key_exchange/KeyExchangeProject";
import CardsTestingProject from "../pages/cards_testing/CardsTestingProject";
import LineDetail from "../pages/orders/LineDetail";
import Instructions from "../pages/instructions/Instructions";
import GeneralReportsPage from "../pages/reports/GeneralReportsPage";


const AppRouter = () => {

    return (
        <Routes>
            <Route path='/projects/' element={<GeneralOrdersPage/>}/>
            <Route path='/projects/:selectedID' element={<LineDetail/>}/>
            {/* <Route path='/contract-annexes/' element={<EmptyComponent/>}/>
            <Route path='/purchase-orders/' element={<EmptyComponent/>}/> */}
            <Route path='/templates/' element={<DocTemplatesPage/>}/>
            <Route path='/instructions/' element={<Instructions/>}/>
            <Route path='/key-exchange/' element={<GeneralKeyExchangePage/>}/>
            <Route path='/key-exchange/:selectedID' element={<KeyExchangeProject/>}/>
            <Route path='/cards-testing/' element={<GeneralCardsTestingPage/>}/>
            <Route path='/cards-testing/:selectedID' element={<CardsTestingProject/>}/>
            <Route path='/dictionary/' element={<MainDictionaryWindow/>}/>
            {/* <Route path='/searching_by_orders/' element={<GeneralSearchingByOrdersPage/>}/> */}
            <Route path='/profile/' element={<Profile/>}/>
            <Route path='/reports/' element={<GeneralReportsPage/>}/>
            {/* <Route path='/test/' element={<EmptyComponent/>}/> */}
            {/* <Route path='/' element={<TestComponent/>}/> */}
            <Route path='*' element={<Navigate to='/projects/'/>}/>
        </Routes>
    );
};

export default AppRouter;