declare let window: CustomWindow;

export interface CustomWindow extends Window {
    dataLayer: any[];
}

const useGoogleAnalytics = () => {
    window.dataLayer = window.dataLayer || [];

    function gtag(...args: any[]): void {
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

        gtag("event", "click", clickEvent);
    };

    return { trackClickEvent };
};

export default useGoogleAnalytics;
