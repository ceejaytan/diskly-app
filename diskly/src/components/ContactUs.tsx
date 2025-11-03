import { useEffect, useState } from "react";
import { API_URL } from "../API/config";
import "../Css/ContactUs.css";
import checkLoginSession from "./Login/CheckLoginSession";


type user_info = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  contact: string;
}


export default function ContactUs() {

  type SessionType = { userid: number; username: string; status: string } | null;
  const [session, setSession] = useState<SessionType>(null);


  useEffect(() => {
    (async () => {
      const userdata = await checkLoginSession();
      if (userdata) {
        setSession({ userid: userdata.user_id, username: userdata.username, status: userdata.status });
      } else {
        setSession(null);
      }
    })();
  }, []);

  const [firstname, setFirstName] = useState("");

  const [lastname, setLastName] = useState("");

  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailValid, setEmailValid] = useState(false);

  const [contact, setContact] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [contactValid, setContactValid] = useState(false);

  const [UserIssue, SetUserIssue] = useState("");
  const [UserIssueValid, SetUserIssueValid] = useState(false);


  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");


  const emailRegex = /^[A-Za-z0-9._+-]{3,20}@[^\s@]+\.[A-Za-z]{2,}$/;
  const contactRegex = /^9\d{9}$/;


  useEffect(() => {
    if (!email) {
      setEmailMessage("");
      setEmailValid(false);
      return;
    }

    if (!emailRegex.test(email)) {
      setEmailMessage("Invalid email");
      setEmailValid(false);
      return;
    }else {
      setEmailMessage("");
      setEmailValid(true);
    }

  }, [email]);

  useEffect(() => {
    if (!contact) {
      setContactMessage("");
      setContactValid(false);
      return;
    }
    if(!contactRegex.test(contact)) {
      setContactMessage("Invalid Contact! example: 9232404697")
      setContactValid(false)
      return;
    }else {
      setContactMessage("");
      setContactValid(true);
    }
  }, [contact])



  useEffect(() => {
    if (UserIssue.length > 120 ){
      SetUserIssueValid(true)
    }else{
      SetUserIssueValid(false)
    }
  })

  async function SubmitData(e: any){
    e.preventDefault();
    setLoading(true);
    setSubmitMessage("")

    const formdata = new FormData();
    formdata.append("first_name", firstname);
    formdata.append("last_name", lastname);
    formdata.append("email", email);
    formdata.append("contact", contact);
    formdata.append("user_issue", UserIssue);

    try{
      const res = await fetch(`${API_URL}/user/contact-us`, {
        method: "POST",
        body: formdata
      });
      if (res.ok) {
        setLoading(false);
        setSubmitMessage("Successfully Submitted")
        setFirstName("");
        setLastName("");
        setEmail("");
        setContact("");
        SetUserIssue("");
      }else{
        setLoading(false);
        setSubmitMessage("Failed to submit")
      }
    }catch (err){
      console.log(err);
      setLoading(false);
      setSubmitMessage("Something went wrong")
    }
    setLoading(false);
  }


  async function fetch_user_info(){
    const res = await fetch(`${API_URL}/user/user-info?id=${session?.userid}`)
    const data = await res.json();

    setFirstName(data[0].first_name);
    setLastName(data[0].last_name);
    setEmail(data[0].email);
    setContact(data[0].contact);
    console.log(data[0]);
    
  }

useEffect(() => {
  if (session?.userid) {
    fetch_user_info();
  }
}, [session]);


  return (


    <div className="contactus-container">
{loading && (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 z-50">
    <div className="w-14 h-14 border-4 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
    <p className="mt-4 text-cyan-300 text-lg font-semibold">Submitting...</p>
  </div>
)}

    {submitMessage && (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-black/70 z-50">
        <div className="submitMessage bg-[#0b0e13] border-2 border-cyan-400 rounded-2xl text-center">
          <h3 className="text-cyan-300 text-xl font-bold ">Message Sent</h3>
          <p className="text-gray-300 mb-4">{submitMessage}</p>
          <button
            onClick={() => setSubmitMessage("")}
          >
            OK
          </button>
        </div>
      </div>
    )}
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

          <form className="contact-form" onSubmit={(e) => SubmitData(e)}>
            <div className="form-row">
              <input 
                value={firstname}
                onChange={(e) => {setFirstName(e.target.value)}}
                type="text"
                placeholder="First name"
                required
              />
              <input
                value={lastname}
                onChange={(e) => {setLastName(e.target.value)}}
                type="text"
                placeholder="Last name"
                required />
            </div>
              <div className="input-group">
                {email && <small className="text-red-500">{emailMessage}</small>}
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${email === "" ? "" : emailValid ? "Inputvalid" : "Inputinvalid"}`}
                  type="email"
                  placeholder="Your email"
                  required
                />
              </div>
            <div className="form-group">
              {contact && <small className="text-red-500">{contactMessage}</small>}
              <div className="contact-field">
                <span className="country-code">+63</span>
                <input
                  type="tel"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className={`
                    ${contact === "" ? "" : contactValid ? "Inputvalid" : "Inputinvalid"}
                  `}
                />
              </div>
            </div>

              {UserIssueValid && <small className="text-red-500">Max 120 characters ( {UserIssue.length} / 120 )</small>}
            <textarea
              value={UserIssue}
              onChange={(e) => {SetUserIssue(e.target.value)}}
              className={`
                ${UserIssue === "" ? "" : UserIssue.length < 120 ? "Inputvalid" : "Inputinvalid"}
              `}
              placeholder="How can we help? ( 120 characters )"
              required></textarea>
            <button 
              type="submit"
              className="
              submit-btn
              "
              disabled={!firstname || !lastname || !emailValid || !contactValid || !UserIssue || UserIssue.length > 120}
            >
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
