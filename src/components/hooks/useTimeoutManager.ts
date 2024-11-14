import { useEffect, useRef } from 'react';

interface ITimeoutManager {
    [key: string]: number[];
}

const useTimeoutManager = (componentName: string) => {
    const timeoutIds = useRef<ITimeoutManager>({});

    const setManagedTimeout = (callback: () => void, delay: number): number => {
        const timeoutId = window.setTimeout(callback, delay);
        if (!timeoutIds.current[componentName]) {
            timeoutIds.current[componentName] = [];
        }
        timeoutIds.current[componentName].push(timeoutId);
        return timeoutId;
    };

    const clearAllTimeoutsForComponent = () => {
        if (timeoutIds.current[componentName]) {
            timeoutIds.current[componentName].forEach(clearTimeout);
            delete timeoutIds.current[componentName];
        }
    };

    useEffect(() => {
        return () => {
            clearAllTimeoutsForComponent();
        };
    }, [componentName]);

    return setManagedTimeout;
};

export default useTimeoutManager;
