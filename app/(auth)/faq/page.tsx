import Link from "next/link";

export const metadata = {
    title: "Nardium",
    description: "Explore and Navigate your Google Docs with Ease! 🔍",
};

export default function FAQ() {
    return (
        <section className="relative">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="pt-32 pb-12 md:pt-40 md:pb-20">
                    {/* Page header */}
                    <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                        <h1 className="h1">Frequently Asked Questions</h1>
                    </div>

                    {/* Form */}
                    <div className="min-w-sm max-w-[900px] mx-auto">
                        <h2 className="h2 text-gray-800 pb-4">How does Nardium Work?</h2>
                        <p className="pb-16">
                            Simply install the chrome extension, then open any google docs document you have. You will
                            see the Nardium Navigation Panel located on the left of your document with a "Sign in with
                            Google" button. Once you sign in to your google account and grant the Nardium app
                            permissions it will then be able to identify all the headings within your document and
                            display them within the navigation panel accordingly.
                        </p>

                        <h2 className="h2 text-gray-800 pb-4">
                            Is Nardium available for other browsers besides Google Chrome?
                        </h2>
                        <p className="pb-16">
                            Yes. Nardium will work on any Chromium based Web Browser. That means: Google Chrome,
                            Microsoft Edge, Opera, Brave, Vivaldi, SRWare Iron, Epic Privacy Browser, Torch Browser,
                            Comodo Dragon.
                        </p>

                        <h2 className="h2 text-gray-800 pb-4">
                            Does Nardium require any additional permissions or access to my personal information?
                        </h2>
                        <p className="pb-16">
                            Nardium only requires necessary permissions to function as a Google Chrome extension within
                            Google Docs. It does not access or collect any personal information beyond what is required
                            for its intended purpose which is to display your document's headings in a simple manor.
                        </p>

                        <h2 className="h2 text-gray-800 pb-4">Nardium has stopped working on my device :(</h2>
                        <p className="pb-16">
                            If a user clears local storage on their device, it may affect Nardium's ability to run as
                            expected. The easiest thing to do if you experience this problem, is to go into your Google
                            Account's settings, find the "Third-party apps & services" section, find Nardium, and click
                            "Delete all connections with this App". This will essentially reset your connection with the
                            app, and you can then go ahead and install a fresh version of it again which should renew
                            all your previous settings and get it back to working order.
                        </p>

                        <h2 className="h2 text-gray-800 pb-4">
                            Can I disable or uninstall Nardium if I no longer need it?
                        </h2>
                        <p className="pb-16">
                            Yes, you can easily disable or uninstall Nardium from your Google Chrome browser's
                            extensions settings. Simply locate Nardium in the list of installed extensions and choose
                            the appropriate action to remove it.
                        </p>

                        <div className="flex justify-center mt-4 mb-8">
                            <Link
                                href="/feature-requests"
                                title="Request a New Feature!"
                                className="inline-block font-medium text-white bg-blue-500 hover:bg-blue-600 px-8 py-4 rounded-xl text-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
                            >
                                Request a Feature!
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
