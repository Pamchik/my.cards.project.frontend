import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import CreateNewPersoVendorModal from './CreateNewPersoVendorModal';
import CreateNewProcessingModal from './CreateNewProcessingModal';
import CreateNewBankModal from './CreateNewBankModal';
import CreateNewBankEmployeeModal from './CreateNewBankEmployeeModal';
import CreateNewBankBIDModal from './CreateNewBankBIDModal';
import CreateNewVendorModal from './CreateNewVendorModal';
import CreateNewVendorEmployeeModal from './CreateNewVendorEmployeeModal';
import CreateNewVendorManufactureModal from './CreateNewVendorManufactureModal';
import CreateNewChipModal from './CreateNewChipModal';
import CreateNewPaymentSystemModal from './CreateNewPaymentSystemModal';
import CreateNewMifareModal from './CreateNewMifareModal';
import CreateNewMagstripeColorModal from './CreateNewMagstripeColorModal';
import CreateNewLaminationModal from './CreateNewLaminationModal';
import CreateNewMaterialModal from './CreateNewMaterialModal';
import CreateNewMaterialColorModal from './CreateNewMaterialColorModal';
import CreateNewProductTypeModal from './CreateNewProductTypeModal';
import CreateNewAntennaModal from './CreateNewAntennaModal';
import CreateNewEffectModal from './CreateNewEffectModal';
import CreateNewProductCategoryModal from './CreateNewProductCategoryModal';
import AddNewFileModal from './AddNewFileModal';
import ChangeFileDataModal from './ChangeFileDataModal';
import CreateNewLineModal from './CreateNewLineModal';
import CreateNewKeyExchangeModal from './CreateNewKeyExchangeModal';
import CreateNewCardTestingProjectModal from './CreateNewCardTestingProjectModal';
import AddExistFileModal from './AddExistFileModal';
import TransferTestCardModal from './TransferTestCardModal';
import CreateNewCountryModal from './CreateNewCountryModal';
import CreateNewAppletModal from './CreateNewAppletModal';
import LinePreviewModal from './LinePreviewModal';
import ChangeLineEffectsModal from './ChangeLineEffectsModal';
import AddNewDeliveryModal from './AddNewDeliveryModal';
import AddNewPaymentModal from './AddNewPaymentModal';
import ChangeFolderModal from './ChangeFolderModal';
import ChangeNumberLinesModal from './ChangeNumberLinesModal';
import MonthlyAccountingReport from '../reports/monthlyAccountingReport/MonthlyAccountingReport';
import ChangeLineItemsModal from './ChangeLineItemsModal';

const ModalsCombineComponent = () => {

    const modals = useSelector((state: RootState) => state.modals) || []

    return (<>
        {modals.includes('ChangeLineEffectsModal') && <ChangeLineEffectsModal/>}
        {modals.includes('TransferTestCardModal') && <TransferTestCardModal/>}
        {modals.includes('CreateNewLineModal') && <CreateNewLineModal/>}   
        {modals.includes('CreateNewCardTestingProjectModal') && <CreateNewCardTestingProjectModal/>}           
        {modals.includes('CreateNewKeyExchangeModal') && <CreateNewKeyExchangeModal/>}           
        {modals.includes('CreateNewBankModal') && <CreateNewBankModal/>}
        {modals.includes('CreateNewChipModal') && <CreateNewChipModal/>}
        {modals.includes('CreateNewPersoVendorModal') && <CreateNewPersoVendorModal/>}
        {modals.includes('CreateNewProcessingModal') && <CreateNewProcessingModal/>}
        {modals.includes('CreateNewBankEmployeeModal') && <CreateNewBankEmployeeModal/>}
        {modals.includes('CreateNewBankBIDModal') && <CreateNewBankBIDModal/>}
        {modals.includes('CreateNewLaminationModal') && <CreateNewLaminationModal/>}
        {modals.includes('CreateNewMaterialColorModal') && <CreateNewMaterialColorModal/>}
        {modals.includes('CreateNewMaterialModal') && <CreateNewMaterialModal/>}
        {modals.includes('CreateNewEffectModal') && <CreateNewEffectModal/>}
        {modals.includes('CreateNewProductTypeModal') && <CreateNewProductTypeModal/>}
        {modals.includes('CreateNewAntennaModal') && <CreateNewAntennaModal/>}
        {modals.includes('CreateNewMagstripeColorModal') && <CreateNewMagstripeColorModal/>}
        {modals.includes('CreateNewVendorModal') && <CreateNewVendorModal/>}
        {modals.includes('CreateNewVendorEmployeeModal') && <CreateNewVendorEmployeeModal/>}
        {modals.includes('CreateNewVendorManufactureModal') && <CreateNewVendorManufactureModal/>}  
        {modals.includes('CreateNewProductCategoryModal') && <CreateNewProductCategoryModal/>}  
        {modals.includes('CreateNewPaymentSystemModal') && <CreateNewPaymentSystemModal/>}
        {modals.includes('CreateNewMifareModal') && <CreateNewMifareModal/>}
        {modals.includes('CreateNewAppletModal') && <CreateNewAppletModal/>}
        {modals.includes('AddNewFileModal') && <AddNewFileModal/>}
        {modals.includes('AddExistFileModal') && <AddExistFileModal/>}
        {modals.includes('ChangeFileDataModal') && <ChangeFileDataModal/>}
        {modals.includes('CreateNewCountryModal') && <CreateNewCountryModal/>}
        {modals.includes('LinePreviewModal') && <LinePreviewModal/>}
        {modals.includes('AddNewDeliveryModal') && <AddNewDeliveryModal/>}
        {modals.includes('AddNewPaymentModal') && <AddNewPaymentModal/>}
        {modals.includes('ChangeFolderModal') && <ChangeFolderModal/>}
        {modals.includes('ChangeNumberLinesModal') && <ChangeNumberLinesModal/>}
        {modals.includes('MonthlyAccountingReport') && <MonthlyAccountingReport/>}
        {modals.includes('ChangeLineItemsModal') && <ChangeLineItemsModal/>}
        
    </>);
};

export default ModalsCombineComponent; 