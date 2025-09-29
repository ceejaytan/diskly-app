import React from "react";
import "./Terms.css";

const TermsPage: React.FC<{ navigateBack: () => void }> = ({
  navigateBack,
}) => {
  return (
    <>
      <div className="terms-container">
        {}
        <div className="back-arrow" onClick={() => window.history.back()}>
          ←
        </div>
        <div className="first-container">
          <div style={{ padding: "2rem" }}>
            <h1>Terms and Conditions</h1>

            <p style={{ marginBottom: "10px" }}>
              {" "}
              <i>
                Welcome to DISKLY! Please read these terms carefully before
                renting games.
              </i>
            </p>

            <p>
              1. You must provide accurate personal information such as your
              name, email, and phone number when creating an account. Keep your
              password secure, and update your profile whenever your contact
              information changes.
            </p>

            <p>
              2. You must meet age requirements to rent certain games, and all
              games must be returned within the specified rental period. Late
              returns, lost, or damaged games may incur fees, and rentals are
              subject to availability on a first-come, first-served basis.
            </p>

            <p>
              3. Payment is only accepted on-site using cash at the time of
              rental. Refunds are not issued once a rental has been approved.
            </p>

            <p>
              4. Games are available for in-store pickup only and must be
              returned in good condition. Late returns will incur fees and may
              negatively affect your account standing.
            </p>

            <p>
              5. We only collect necessary personal data to provide our rental
              services. Your information is stored securely and will not be
              shared with third parties without your consent.
            </p>

            <p>
              6. Accounts can be closed at the user’s request at any time.
              Rental privileges may be suspended or revoked for repeated
              violations of these terms.
            </p>

            <p>
              7. All users are expected to follow rental rules to ensure a
              smooth and fair experience for everyone. Failure to comply may
              result in penalties, including fees, loss of rental privileges, or
              account suspension.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsPage;
