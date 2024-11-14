import { useState } from "react";
import BankInfo from "./banks/BankInfo";
import VendorInfo from "./vendors/VendorInfo";
import ButtonMain from "../../UI/buttons/ButtonMain";
import TabBlock from "../../UI/tabs/TabBlock";
import { useDispatch } from "react-redux";
import { setComponentsAPIUpdate } from "../../../store/componentsData/componentsAPIUpdateSlice";
import ChipInfo from "./chips/ChipInfo";
import MifareInfo from "./mifares/MifareInfo";
import MagstripeColorInfo from "./magstripes/MagstripeColorInfo";
import LaminationInfo from "./laminations/LaminationInfo";
import MaterialInfo from "./materials/MaterialInfo";
import AntennaInfo from "./antenna/AntennaInfo";
import PaymentSystemInfo from "./paymentSystems/PaymentSystemInfo";
import PersoVendorInfo from "./persoVendors/PersoVendorInfo";
import ProcessingInfo from "./processings/ProcessingInfo";
import EffectInfo from "./effects/EffectInfo";
import ProductTypeInfo from "./products/ProductTypeInfo";
import CountryInfo from "./countries/CountryInfo";
import AppletInfo from "./applets/AppletInfo";


const MainDictionaryWindow = () => {

    const componentName = 'MainDictionaryWindow'
    const dispatch = useDispatch()

    const navigationMap: Record<string, React.ComponentType<any>> = {
        'Страны': CountryInfo,        
        'Банки': BankInfo,
        'Вендоры': VendorInfo,
        'Чип': ChipInfo,
        'Applet': AppletInfo,
        'Mifare': MifareInfo,
        'Магнитная полоса': MagstripeColorInfo,
        'Ламинация': LaminationInfo,
        'Тип продукта': ProductTypeInfo,
        'Материалы': MaterialInfo,
        'Антенна': AntennaInfo,
        'Эффекты': EffectInfo,
        'ПС': PaymentSystemInfo,
        'Персо-вендоры': PersoVendorInfo,
        'Процессинги': ProcessingInfo,

    };
    const navigationArray: React.ComponentType<any>[] = Object.values(navigationMap);
   
    const [activeTab, setActiveTab] = useState<number>(0);
    const ActiveComponent = navigationArray[activeTab];
    

    function funcUpdateData() {
        if (activeTab === 0) {
            dispatch(setComponentsAPIUpdate(['countriesData', 'countryData']))
        } else if (activeTab === 1) {
            dispatch(setComponentsAPIUpdate(['bankEmployeeData', 'bankEmployeesData', 'bankBIDData', 'bankBIDsData', 'bankData', 'banksData', 'countriesData', 'processingCentersData', 'persoScriptVendorsData']))
        } else if (activeTab === 2) {
            dispatch(setComponentsAPIUpdate(['vendorsData', 'vendorData', 'vendorEmployeesData', 'vendorEmployeeData', 'vendorManufactureData', 'vendorManufacturiesData']))
        } else if (activeTab === 3) {
            dispatch(setComponentsAPIUpdate(['chipsData', 'chipData', 'vendorsData', 'paymentSystemsData', 'mifaresData']))
        } else if (activeTab === 4) {
            dispatch(setComponentsAPIUpdate(['appletsData', 'appletData']))
        } else if (activeTab === 5) {
            dispatch(setComponentsAPIUpdate(['mifaresData', 'mifareData']))
        } else if (activeTab === 6) {
            dispatch(setComponentsAPIUpdate(['magstripeColorData', 'vendorsData', 'magstripeTracksData', 'magstripeColorsData']))
        } else if (activeTab === 7) {
            dispatch(setComponentsAPIUpdate(['laminationData', 'vendorsData', 'laminationsData']))
        } else if (activeTab === 8) {
            dispatch(setComponentsAPIUpdate(['productTypeData', 'productTypesData', 'vendorsData']))
        } else if (activeTab === 9) {
            dispatch(setComponentsAPIUpdate(['materialData', 'productTypesData', 'vendorsData', 'materialsData', 'materialColorsData', 'materialColorData']))
        } else if (activeTab === 10) {
            dispatch(setComponentsAPIUpdate(['antennasData', 'vendorsData', 'antennaData']))
        } else if (activeTab === 11) {
            dispatch(setComponentsAPIUpdate(['effectData', 'effectsData', 'productTypesData', 'effectMatchingData', 'effectsMatchingData']))
        } else if (activeTab === 12) {
            dispatch(setComponentsAPIUpdate(['paymentSystemData', 'paymentSystemsData', 'productCategoriesData', 'productCategoryData']))
        } else if (activeTab === 13) {
            dispatch(setComponentsAPIUpdate(['persoVendorData', 'persoVendorsData']))
        } else if (activeTab === 14) {
            dispatch(setComponentsAPIUpdate(['processingsData', 'processingData']))
        }
    }


    return (
        <div style={{width: '100%', height: '100%', display: 'flex', flexDirection: 'column'}}>
            <div className="top-info-block">
                <div className="top-info-block__fields" style={{width: 'calc(100% - 50px)'}}>
                    <TabBlock
                        items={Object.keys(navigationMap)}
                        selectedItem={activeTab}
                        onIndexChange={(index) => setActiveTab(index)}
                    />
                </div>
                <div className="top-info-block__btn-block" style={{width: '30px'}}>
                    <ButtonMain
                        type={'repeatIcon'}
                        onClick={() => funcUpdateData()}
                    />
                </div>
            </div>
            <div className='bottom-context-block'>
                <ActiveComponent />
            </div>
        </div>
    );
};

export default MainDictionaryWindow;