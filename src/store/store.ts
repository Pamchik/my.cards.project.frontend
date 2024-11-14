import { configureStore } from '@reduxjs/toolkit'
import userReducer from './user/userSlice'
import sessionIdReducer from './user/sessionIdSlice'
import loadingProcessReducer from './componentsData/loadingProcessSlice'
import fieldsParamsReducer from './componentsData/fieldsParamsSlice'
import componentsReadOnlyReducer from './componentsData/componentsReadOnlySlice'
import savingProcessReducer from './componentsData/savingProcessSlice'
import componentsDataReducer from './componentsData/componentsDataSlice'
import fieldsInvalidReducer from './componentsData/fieldsInvalidSlice'
import componentsAPIUpdateReducer from './componentsData/componentsAPIUpdateSlice'
import modalsReducer from './modalData/modalsSlice'
import modalsPropsDataReducer from './modalData/modalsPropsDataSlice'
import tablesDataReducer from './tableData/tablesDataSlice'
import tablesResetParamsReducer from './tableData/tablesResetParamsSlice'

import {userApi} from './api/userApiSlice'
import { bankApi } from './api/bankApiSlice'
import { countryApi } from './api/countryApiSlice'
import { bankBIDApi } from './api/bankBIDApiSlice'
import { bankEmployeeApi } from './api/bankEmployeeApiSlice'
import { vendorApi } from './api/vendorApiSlice'
import { vendorEmployeeApi } from './api/vendorEmployeeApiSlice'
import { vendorManufactureApi } from './api/vendorManufacturiesApiSlice'
import { chipApi } from './api/chipApiSlice'
import { paymentSystemApi } from './api/paymentSystemApiSlice'
import { mifareApi } from './api/mifareApiSlice'
import { magstripeColorApi } from './api/magstripeColorApiSlice'
import { magstripeTrackApi } from './api/magstripeTrackApiSlice'
import { laminationApi } from './api/laminationApiSlice'
import { materialApi } from './api/materialApiSlice'
import { materialColorApi } from './api/materialColorApiSlice'
import { productTypeApi } from './api/productTypeApiSlice'
import { antennaApi } from './api/antennaApiSlice'
import { productCategoryApi } from './api/productCategoryApiSlice'
import { persoVendorApi } from './api/persoVendorApiSlice'
import { processingApi } from './api/processingApiSlice'
import { effectApi } from './api/effectApiSlice'
import { effectMatchingApi } from './api/effectsMatchingApiSlice'
import { startYearApi } from './api/startYearApiSlice'
import { projectApi } from './api/projectsApiSlice'
import { fileApi } from './api/fileApiSlice'
import { keyExchangeApi } from './api/keyExchangeApiSlice'
import { cardTestingApi } from './api/cardTestingApiSlice'
import { cardTestTypeApi } from './api/cardTestTypeApiSlice'
import { fileStatusApi } from './api/fileStatusApiSlice'
import { keyExchangeStatusApi } from './api/keyExchangeStatusApiSlice'
import { relevantFileApi } from './api/relevantFileApiSlice'
import { cardTestingStatusApi } from './api/cardTestingStatusApiSlice'
import { testCardTransferApi } from './api/testCardTransferApiSlice'
import { transferActionApi } from './api/transferActionApiSlice'
import { cardTestingShortRelevantApi } from './api/cardTestingShortRelevantApiSlice'
import { appletApi } from './api/appletApiSlice'
import { processNamesApi } from './api/processNamesApiSlice'
import { processDataApi } from './api/processDataApiSlice'
import { processStatusApi } from './api/processStatusApiSlice'
import { projectStatusApi } from './api/projectStatusApiSlice'
import { deliveryInfoApi } from './api/deliveryInfoApiSlice'
import { chipColorApi } from './api/chipColorApiSlice'
import { annexesConditionApi } from './api/annexesConditionApiSlice'
import { currencyApi } from './api/currencyApiSlice'
import { paymentInfoApi } from './api/paymentInfoApiSlice'
import { bankPriceApi } from './api/bankPriceApiSlice'
import { vendorPriceApi } from './api/vendorPriceApiSlice'
import { paymentTypeApi } from './api/paymentTypeApiSlice'
import { paymentSystemApprovalApi } from './api/paymentSystemApprovalApiSlice'
import { POConditionApi } from './api/POConditionApiSlice'
import { productionDataApi } from './api/productionDataApiSlice'
import { folderPathApi } from './api/folderPathApiSlice'
import { foldersApi } from './api/foldersApiSlice'
import { galleryApi } from './api/galleryApiSlice'
import { fileFormatApi } from './api/fileFormatApiSlice'
import { changelogApi } from './api/changelogApiSlice'
import { reportApi } from './api/reportApiSlice'


export const store = configureStore({
    reducer: {
        user: userReducer,
        sessionId: sessionIdReducer,
        loadingProcess: loadingProcessReducer,
        fieldsParams: fieldsParamsReducer,
        componentsReadOnly: componentsReadOnlyReducer,
        savingProcess: savingProcessReducer,   
        componentsData: componentsDataReducer,
        fieldsInvalid: fieldsInvalidReducer,
        componentsAPIUpdate: componentsAPIUpdateReducer,
        modals: modalsReducer,
        modalsPropsData: modalsPropsDataReducer,
        tablesData: tablesDataReducer,
        tablesResetParams: tablesResetParamsReducer,
        
        [userApi.reducerPath]: userApi.reducer,
        [bankApi.reducerPath]: bankApi.reducer,
        [countryApi.reducerPath]: countryApi.reducer,
        [bankBIDApi.reducerPath]: bankBIDApi.reducer,
        [bankEmployeeApi.reducerPath]: bankEmployeeApi.reducer,
        [vendorApi.reducerPath]: vendorApi.reducer,
        [vendorManufactureApi.reducerPath]: vendorManufactureApi.reducer,
        [vendorEmployeeApi.reducerPath]: vendorEmployeeApi.reducer,
        [chipApi.reducerPath]: chipApi.reducer,
        [paymentSystemApi.reducerPath]: paymentSystemApi.reducer,
        [mifareApi.reducerPath]: mifareApi.reducer,
        [magstripeColorApi.reducerPath]: magstripeColorApi.reducer,
        [magstripeTrackApi.reducerPath]: magstripeTrackApi.reducer,
        [laminationApi.reducerPath]: laminationApi.reducer,
        [materialApi.reducerPath]: materialApi.reducer,
        [materialColorApi.reducerPath]: materialColorApi.reducer,
        [productTypeApi.reducerPath]: productTypeApi.reducer,
        [antennaApi.reducerPath]: antennaApi.reducer,
        [productCategoryApi.reducerPath]: productCategoryApi.reducer,
        [persoVendorApi.reducerPath]: persoVendorApi.reducer,
        [processingApi.reducerPath]: processingApi.reducer,
        [effectApi.reducerPath]: effectApi.reducer,
        [effectMatchingApi.reducerPath]: effectMatchingApi.reducer,
        [startYearApi.reducerPath]: startYearApi.reducer,
        [projectApi.reducerPath]: projectApi.reducer,
        [fileApi.reducerPath]: fileApi.reducer,
        [keyExchangeApi.reducerPath]: keyExchangeApi.reducer,
        [cardTestingApi.reducerPath]: cardTestingApi.reducer,
        [cardTestTypeApi.reducerPath]: cardTestTypeApi.reducer,
        [fileStatusApi.reducerPath]: fileStatusApi.reducer,
        [keyExchangeStatusApi.reducerPath]: keyExchangeStatusApi.reducer,
        [relevantFileApi.reducerPath]: relevantFileApi.reducer,
        [cardTestingStatusApi.reducerPath]: cardTestingStatusApi.reducer,
        [testCardTransferApi.reducerPath]: testCardTransferApi.reducer,
        [transferActionApi.reducerPath]: transferActionApi.reducer,
        [cardTestingShortRelevantApi.reducerPath]: cardTestingShortRelevantApi.reducer,
        [appletApi.reducerPath]: appletApi.reducer,
        [processNamesApi.reducerPath]: processNamesApi.reducer,
        [processDataApi.reducerPath]: processDataApi.reducer,
        [processStatusApi.reducerPath]: processStatusApi.reducer,
        [projectStatusApi.reducerPath]: projectStatusApi.reducer,
        [deliveryInfoApi.reducerPath]: deliveryInfoApi.reducer,
        [chipColorApi.reducerPath]: chipColorApi.reducer,
        [annexesConditionApi.reducerPath]: annexesConditionApi.reducer,
        [currencyApi.reducerPath]: currencyApi.reducer,
        [paymentInfoApi.reducerPath]: paymentInfoApi.reducer,
        [bankPriceApi.reducerPath]: bankPriceApi.reducer,
        [vendorPriceApi.reducerPath]: vendorPriceApi.reducer,
        [paymentTypeApi.reducerPath]: paymentTypeApi.reducer,
        [paymentSystemApprovalApi.reducerPath]: paymentSystemApprovalApi.reducer,
        [POConditionApi.reducerPath]: POConditionApi.reducer,
        [productionDataApi.reducerPath]: productionDataApi.reducer,
        [folderPathApi.reducerPath]: folderPathApi.reducer,
        [foldersApi.reducerPath]: foldersApi.reducer,
        [galleryApi.reducerPath]: galleryApi.reducer,
        [fileFormatApi.reducerPath]: fileFormatApi.reducer,
        [changelogApi.reducerPath]: changelogApi.reducer,
        [reportApi.reducerPath]: reportApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(userApi.middleware)
        .concat(bankApi.middleware)
        .concat(countryApi.middleware)
        .concat(bankBIDApi.middleware)
        .concat(bankEmployeeApi.middleware)
        .concat(vendorApi.middleware)
        .concat(vendorManufactureApi.middleware)
        .concat(vendorEmployeeApi.middleware)
        .concat(chipApi.middleware)
        .concat(paymentSystemApi.middleware)
        .concat(mifareApi.middleware)
        .concat(magstripeColorApi.middleware)
        .concat(magstripeTrackApi.middleware)
        .concat(laminationApi.middleware)
        .concat(materialApi.middleware)
        .concat(materialColorApi.middleware)
        .concat(productTypeApi.middleware)
        .concat(antennaApi.middleware)
        .concat(productCategoryApi.middleware)
        .concat(persoVendorApi.middleware)
        .concat(processingApi.middleware)
        .concat(effectApi.middleware)
        .concat(effectMatchingApi.middleware)
        .concat(startYearApi.middleware)
        .concat(projectApi.middleware)
        .concat(fileApi.middleware)
        .concat(keyExchangeApi.middleware)
        .concat(cardTestingApi.middleware)
        .concat(cardTestTypeApi.middleware)
        .concat(fileStatusApi.middleware)
        .concat(keyExchangeStatusApi.middleware)
        .concat(relevantFileApi.middleware)
        .concat(cardTestingStatusApi.middleware)
        .concat(testCardTransferApi.middleware)
        .concat(transferActionApi.middleware)
        .concat(cardTestingShortRelevantApi.middleware)
        .concat(appletApi.middleware)
        .concat(processNamesApi.middleware)
        .concat(processDataApi.middleware)
        .concat(processStatusApi.middleware)
        .concat(projectStatusApi.middleware)
        .concat(deliveryInfoApi.middleware)
        .concat(chipColorApi.middleware)
        .concat(annexesConditionApi.middleware)
        .concat(currencyApi.middleware)
        .concat(paymentInfoApi.middleware)
        .concat(bankPriceApi.middleware)
        .concat(vendorPriceApi.middleware)
        .concat(paymentTypeApi.middleware)
        .concat(paymentSystemApprovalApi.middleware)
        .concat(POConditionApi.middleware)
        .concat(productionDataApi.middleware)
        .concat(folderPathApi.middleware)
        .concat(foldersApi.middleware)
        .concat(galleryApi.middleware)
        .concat(fileFormatApi.middleware)
        .concat(changelogApi.middleware)
        .concat(reportApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch