declare let window: CustomWindow;

export interface CustomWindow extends Window {
    gtag: any;
}

const useGoogleAnalytics = () => {
    const trackClickEvent = (itemName: string) => {
        if (!window.gtag) {
            console.log("No Google Analytics Found.");
            return;
        }

        const clickEvent = {
            event: "click",
            clickType: itemName,
        };

        window.gtag("event", clickEvent);
    };

    return { trackClickEvent };
};

export default useGoogleAnalytics;
