import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useMemo } from 'react';
import { isEqual } from 'lodash';

const useDeepEqualSelector = <TSelected>(
    selector: (state: RootState) => TSelected
): TSelected => {
    return useSelector(selector, isEqual);
};

export const useEffectStoreData = (componentName: string) => {
    const loadingProcess = useDeepEqualSelector((state: RootState) => state.loadingProcess[componentName]);
    const fieldParams = useDeepEqualSelector((state: RootState) => state.fieldsParams[componentName]);
    const savingProcess = useDeepEqualSelector((state: RootState) => state.savingProcess[componentName]);
    const componentData = useDeepEqualSelector((state: RootState) => state.componentsData[componentName]);
    const componentInvalidFields = useDeepEqualSelector((state: RootState) => state.fieldsInvalid[componentName]);
    const componentReadOnly = useDeepEqualSelector((state: RootState) => state.componentsReadOnly[componentName]);
    const componentsAPIUpdate = useDeepEqualSelector((state: RootState) => state.componentsAPIUpdate);
    const modalsPropsData = useDeepEqualSelector((state: RootState) => state.modalsPropsData[componentName]);
    const tableData = useDeepEqualSelector((state: RootState) => state.tablesData[componentName]);
    const tableResetParams = useDeepEqualSelector((state: RootState) => state.tablesResetParams[componentName]);

    return useMemo(
        () => ({
            loadingProcess,
            fieldParams,
            savingProcess,
            componentData,
            componentInvalidFields,
            componentReadOnly,
            componentsAPIUpdate,
            modalsPropsData,
            tableData,
            tableResetParams
        }),
        [
            loadingProcess,
            fieldParams,
            savingProcess,
            componentData,
            componentInvalidFields,
            componentReadOnly,
            componentsAPIUpdate,
            modalsPropsData,
            tableData,
            tableResetParams
        ]
    );
};