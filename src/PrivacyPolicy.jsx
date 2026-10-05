import { useEffect } from 'react'

export default function PrivacyPolicy() {
  useEffect(() => {
    const previous = document.title
    document.title = 'Privacy Policy — Chapersons Foundations'
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <main className="privacy-page">
      <h1>Privacy Policy</h1>
      <p className="privacy-meta">
        Chapersons Foundations Pay Receipt app
        <br />
        Last updated: 5 October 2026
      </p>
      <p>
        This policy explains how Chapersons Foundations handles information in the Pay Receipt Android app (package name com.imt.payreceipt). The app is for staff who record donation receipts. It is not a public signup app.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Staff account.</strong> An administrator creates each account with a name, email address, mobile number, and password. Passwords are stored only as a secure hash. The app does not let someone create their own account.
        </li>
        <li>
          <strong>Receipt details entered by signed-in staff.</strong> Donor name, address, mobile number, donation amount, payment reference (cash, cheque, draft, or GPay number), fundraiser name, receipt date, and an optional handwritten signature.
        </li>
        <li>
          <strong>On the device.</strong> After sign-in, the app stores a login token and the staff member’s name, email, and mobile number so they stay signed in. Signing out deletes that information from the device. A receipt PDF may be saved in the app’s temporary storage so it can be opened.
        </li>
      </ul>
      <p>The app does not collect location, contacts, photos from the gallery, advertising ID, or analytics identifiers. It does not show advertisements.</p>
      <h2>How we use information</h2>
      <ul>
        <li>To sign staff in and keep the session active.</li>
        <li>To create, store, display, and download donation receipts.</li>
        <li>To operate and protect the service.</li>
      </ul>
      <h2>Where information is stored and who can see it</h2>
      <p>Receipt and account information is sent over HTTPS to our server at payreceipt.immortalgroup.in and stored there for the foundation’s records. Signed-in staff and administrators can access the records they are allowed to use.</p>
      <p>We do not sell personal information. We do not share it with advertisers or data brokers. We may disclose information if the law requires it.</p>
      <h2>How long we keep it</h2>
      <p>Staff account details and receipts are kept for as long as the foundation needs them for its donation records. Signing out removes the saved login from that device. To ask for a staff account or a receipt to be corrected or deleted, contact the administrator using the email below.</p>
      <h2>Children</h2>
      <p>This app is for foundation staff. It is not directed at children, and we do not knowingly collect information from children.</p>
      <h2>Changes</h2>
      <p>If this policy changes, the updated version will be posted on this page with a new date.</p>
      <h2>Contact</h2>
      <p>
        Chapersons Foundations
        <br />
        Email: <a href="mailto:admin@chapersons.com">admin@chapersons.com</a>
      </p>
    </main>
  )
}
