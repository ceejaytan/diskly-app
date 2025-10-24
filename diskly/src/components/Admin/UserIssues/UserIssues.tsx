import { useEffect, useState } from "react";
import { API_URL } from "../../../API/config";
import "./UserIssues.css";

type UserIssueModel = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  contact: string;
  user_issue: string;
};

export default function User_Issues() {
  const [userIssues, setUserIssues] = useState<UserIssueModel[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchIssues() {
    setLoading(true);
    setUserIssues([]);
    try {
      const res = await fetch(`${API_URL}/admin/user-issues`, {
        credentials: "include",
      });
      const data = await res.json();
      setUserIssues(data);
    } catch (err) {
      console.error("Failed to fetch user issues:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchIssues();
  }, []);

  return (
    <main className="user-issues-container">
      <div className="user-issues-header">
        <h1>User Issues</h1>
        <button onClick={() => fetchIssues()}>refresh</button>
        <p>Messages submitted via Contact Us form</p>
      </div>

      {loading ? (
        <div className="user-issues-empty">Loading user issues...</div>
      ) : userIssues.length === 0 ? (
        <div className="user-issues-empty">No user issues found.</div>
      ) : (
        <div className="user-issues-list">
          {userIssues.map((issue) => (
            <div className="user-issue-card" key={issue.id}>
              <div className="user-issue-header">
                <div className="user-issue-info">
                  <h2>
                    {issue.first_name} {issue.last_name}
                  </h2>
                  <p>
                    📞 {issue.contact} &nbsp; | &nbsp; ✉️ {issue.email}
                  </p>
                </div>
                <span className="user-issue-id">ID: {issue.id}</span>
              </div>

              <div className="user-issue-body">
                {issue.user_issue} 
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
