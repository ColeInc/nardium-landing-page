import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="flex justify-center">
            <div className="max-w-4xl py-32">
                <h1 className="font-medium text-lg pb-4">Privacy Policy for Nardium</h1>

                <p>
                    This Privacy Policy governs the manner in which Nardium collects, uses, maintains, and discloses
                    information collected from users (each, a "User") of the Nardium Chrome extension.
                </p>
                <br />

                <h2 className="font-medium text-md py-4">Limited Use Policy</h2>

                <p>
                    Nardium's use and transfer to any other app of information received from Google APIs will adhere
                    to&nbsp;
                    <a
                        href="https://developers.google.com/terms/api-services-user-data-policy#additional_requirements_for_specific_api_scopes"
                        target="_blank"
                        className="text-blue-600 hover:underline hover:text-blue-700"
                    >
                        Google API Services User Data Policy
                    </a>
                    , including the Limited Use requirements.
                </p>
                <br />

                <h2 className="font-medium text-md py-4">1. Personal identification information</h2>

                <p>
                    Nardium may collect personal identification information from Users in various ways, including when
                    Users log in with their Google account. This information may include the user's name and email
                    address. However, Nardium does not store or retain any personal identification information provided
                    by the Users.
                </p>

                <h2 className="font-medium text-md py-4">2. Non-personal identification information</h2>

                <p>
                    Nardium may collect non-personal identification information about Users whenever they interact with
                    the extension. Non-personal identification information may include the browser name, the type of
                    computer or device, and technical information about Users' means of connection to the extension.
                </p>

                <h2 className="font-medium text-md py-4">3. How we use collected information</h2>

                <p>Nardium may collect and use Users' personal information for the following purposes:</p>

                <ul>
                    <li>
                        <strong>To authenticate and authorize access to the Google Docs API:</strong> The extension
                        requires access to the Google Docs API to retrieve the headings from a user's corresponding
                        Google Doc document. The collected information is used solely for the purpose of displaying the
                        headings in the side panel window of the user's Google Docs interface.
                    </li>
                    <li>
                        <strong>To improve user experience:</strong> We may use feedback provided by Users to improve
                        our extension's functionality and user interface.
                    </li>
                    <li>
                        <strong>To send periodic emails (optional):</strong> If Users have opted to receive emails, we
                        may use the provided email address to send occasional updates, announcements, and respond to
                        inquiries. Users can unsubscribe from these emails at any time.
                    </li>
                </ul>

                <h2 className="font-medium text-md py-4">4. How we protect your information</h2>

                <p>
                    We adopt appropriate data collection, storage, and processing practices and security measures to
                    protect against unauthorized access, alteration, disclosure, or destruction of Users' personal
                    information and data stored within our extension.
                </p>

                <h2 className="font-medium text-md py-4">5. Sharing your personal information</h2>

                <p>
                    Nardium does not sell, trade, or rent Users' personal identification information to others. We may
                    share generic aggregated demographic information not linked to any personal identification
                    information regarding Users with our business partners, trusted affiliates, and advertisers for the
                    purposes outlined above.
                </p>

                <h2 className="font-medium text-md py-4">6. Changes to this privacy policy</h2>

                <p>
                    Nardium has the discretion to update this privacy policy at any time. When we do, we will revise the
                    updated date at the bottom of this page. We encourage Users to frequently check this page for any
                    changes to stay informed about how we are helping to protect the personal information we collect.
                    You acknowledge and agree that it is your responsibility to review this privacy policy periodically
                    and become aware of modifications.
                </p>

                <h2 className="font-medium text-md py-4">7. Your acceptance of these terms</h2>
                <p>
                    By using the Nardium extension, you signify your acceptance of this policy. If you do not agree to
                    this policy, please do not use our extension. Your continued use of the extension following the
                    posting of changes to this policy will be deemed your acceptance of those changes.
                </p>

                <h2 className="font-medium text-md py-4">8. Contacting us</h2>
                <p>
                    If you have any questions about this Privacy Policy, the practices of this extension, or your
                    dealings with this extension, please contact us at nardiumapp@gmail.com.
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
