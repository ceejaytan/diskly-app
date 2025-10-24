import "../Css/ContactUs.css";

export default function ContactUs() {
  return (
    <div className="contactus-container">
      <div className="back-arrow" onClick={() => window.history.back()}>
        ←
      </div>

      <div className="contactus-content">
        {/* LEFT SIDE */}
        <div className="contactus-left">
          <h1>Contact Us</h1>
          <p>
            Have Questions or need help with your rental? <br></br>
            We'd love to hear to hear from you!
          </p>

          <div className="contact-details">
            <p>
              <b>Email:</b> diskly.forgetpass@gmail.com
            </p>
            <p>
              <b>Phone:</b> 09451481415
            </p>
          </div>

          <div className="info-sections">
            <div>
              <h3>Customer Support</h3>
              <p>
                Our team is always ready to assist you with your questions and
                concerns.
              </p>
            </div>
            <div>
              <h3>Feedback & Suggestions</h3>
              <p>
                We value your ideas — your feedback helps us improve Diskly
                every day.
              </p>
            </div>
            <div>
              <h3>Inquiries</h3>
              <p>
                For any questions or concerns, please contact us at
                info@disklyapp.com
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (FORM) */}
        <div className="contactus-right">
          <h2>Get in Touch</h2>
          <p>You can reach us anytime</p>

          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="First name" required />
              <input type="text" placeholder="Last name" required />
            </div>
            <input type="email" placeholder="Your email" required />
            <div className="form-row">
              <select>
                <option>+63</option>
                <option>+1</option>
                <option>+44</option>
              </select>
              <input type="tel" placeholder="Phone number" required />
            </div>
            <textarea placeholder="How can we help?" required></textarea>
            <button type="submit" className="submit-btn">
              Submit
            </button>
            <p className="policy-text">
              By contacting us, you agree to our{" "}
              <a href="#">Terms of Service</a> and{" "}
              <a href="#">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
