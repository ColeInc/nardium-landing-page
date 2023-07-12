import { useEffect } from "react";

declare let window: CustomWindow;

export interface CustomWindow extends Window {
    dataLayer: any[];
}

const useGoogleAnalytics = () => {
    useEffect(() => {
        if (typeof window === "undefined") {
            return;
        }

        window.dataLayer = window.dataLayer || [];
    }, []);

    function gtag(...args: any[]): void {
        if (!window || !window.dataLayer) {
            console.log("Failed to initialise Google Analytics.");
            return;
        }
        window.dataLayer.push(...args);
    }

    const trackClickEvent = (itemName: string) => {
        if (!window.dataLayer) {
            console.log("No Google Analytics Found.");
            return;
        }

        const clickEvent = {
            clickType: itemName,
        };

        console.log("triggering dis", "event", "click", clickEvent);
        gtag("event", "click", clickEvent);
    };

    return { trackClickEvent };
};

export default useGoogleAnalytics;
