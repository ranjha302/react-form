 import './App.css';
import { useState } from 'react';
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import emailjs from 'emailjs-com';  // Add EmailJS library
import { jsPDF } from 'jspdf'; // Import jsPDF
import 'jspdf-autotable';

function App() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    gender: '',
    Age: '',
    BirthDay: ''
  });

  const [userData, setUserData] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  // SMS state
  const [smsMessage, setSmsMessage] = useState('');
  const [smsHistory, setSmsHistory] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState(''); // New state for email

  const onChangeHandler = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();

    // Check if all fields are filled
    if (!formData.username || !formData.email || !formData.phoneNumber || !formData.gender) {
      NotificationManager.warning('Please fill out all fields before submitting.', 'Form Incomplete');
      return;
    }

    if (editIndex !== null) {
      // Editing an existing entry
      const updatedUserData = [...userData];
      updatedUserData[editIndex] = formData;
      setUserData(updatedUserData);
      setEditIndex(null);
      NotificationManager.success('Row Data Updated Successfully');
    } else {
      // Adding a new entry
      setUserData([...userData, formData]);
      NotificationManager.success('Your Form Submitted Successfully');
    }
    setFormData({
      username: '',
      email: '',
      phoneNumber: '',
      gender: '',
      Age: '',
      BirthDay: ''
    });
  };

  const handleEdit = (index) => {
    setFormData(userData[index]);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedUserData = userData.filter((_, i) => i !== index);
    setUserData(updatedUserData);
    NotificationManager.info('Row Data Deleted Successfully');
  };

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle SMS submission with email validation
  const handleSmsSubmit = () => {
    if (smsMessage.trim() === '') {
      NotificationManager.warning('Please type a message to send.', 'SMS Incomplete');
      return;
    }

    // Validate the email address
    if (!isValidEmail(recipientEmail)) {
      NotificationManager.error('Please enter a valid email address.');
      return;
    }

    // Send the SMS content via EmailJS to the validated email and also include the recipient's email
    const templateParams = {
      from_name: formData.username,  // You can replace with actual sender's name
      to_email: recipientEmail,  // Send to the validated email
      message: smsMessage,
      user_email: formData.email, // This will be the sender's email (you can add this if needed)
    };

    // Replace the service_id, template_id, and user_id with your EmailJS keys
    emailjs.send('service_94gyx9s', 'template_qjs1bqh', templateParams, 'b6Ei6Zs-VcZAS7bbn')
      .then((response) => {
        console.log('Success:', response);
        NotificationManager.success('SMS Sent Successfully');
        setSmsHistory([...smsHistory, smsMessage]);
        setSmsMessage(''); // Clear SMS message after successful submission
        setRecipientEmail(''); // Clear email after submission
      })
      .catch((error) => {
        console.error('Error:', error);
        NotificationManager.error('Failed to send SMS');
      });
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const tableData = userData.map(data => [
      data.username,
      data.email,
      data.phoneNumber,
      data.gender,
      data.Age,
      data.BirthDay
    ]);

    doc.autoTable({
      head: [['User Name', 'Email', 'Phone Number', 'Gender', 'Age', 'BirthDay']],
      body: tableData
    });

    doc.save('user_data.pdf');
  };

  // Print table data
  const printTable = () => {
    const printWindow = window.open('', '', 'height=500, width=800');
    printWindow.document.write('<html><head><title>Table Data</title></head><body>');
    printWindow.document.write('<h1>Submitted Data</h1>');
    printWindow.document.write('<table border="1"><thead><tr><th>User Name</th><th>Email</th><th>Phone Number</th><th>Gender</th><th>Age</th><th>BirthDay</th></tr></thead><tbody>');
    userData.forEach(data => {
      printWindow.document.write(
        `<tr><td>${data.username}</td><td>${data.email}</td><td>${data.phoneNumber}</td><td>${data.gender}</td><td>${data.Age}</td><td>${data.BirthDay}</td></tr>`
      );
    });
    printWindow.document.write('</tbody></table></body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="App">
      <NotificationContainer />
      <div>
        <div className="image-container">
          <img
            src="https://thumbs.dreamstime.com/b/contact-us-concept-cartoon-people-flat-design-web-man-answering-client-letter-giving-information-to-customers-emails-302575082.jpg"
            alt="Enquiry"
            className="enquiry-image"
          />
        </div>
        <h1 style={{ textAlign: 'center', color: 'Green' }}>Enquiry-form By Hanzala Usman</h1>
      </div>

      <form onSubmit={onSubmitHandler}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">User Name</label>
          <input className="form-control" name="username" onChange={onChangeHandler} value={formData.username} />
        </div>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email</label>
          <input className="form-control" name="email" onChange={onChangeHandler} value={formData.email} />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
          <input className="form-control" name="phoneNumber" onChange={onChangeHandler} value={formData.phoneNumber} />
        </div>
        <div className="form-group">
          <label htmlFor="gender" className="form-label">Gender</label>
          <input className="form-control" name="gender" onChange={onChangeHandler} value={formData.gender} />
        </div>
        <div className="form-group">
          <label htmlFor="Age" className="form-label">Age</label>
          <input className="form-control" name="Age" onChange={onChangeHandler} value={formData.Age} />
        </div>
        <div className="form-group">
          <label htmlFor="BirthDay" className="form-label">BirthDay</label>
          <input className="form-control" name="BirthDay" onChange={onChangeHandler} value={formData.BirthDay} />
        </div>
        
        <div className="form-group">
          <button className="btn" type="submit">{editIndex !== null ? 'Update' : 'Submit'}</button>
        </div>
      </form>

      {/* SMS Box Section */}
      <div>
        <h2 style={{ textAlign: 'center', color: 'Green' }}>SMS Box</h2>
        <div className="form-group">
          <textarea
            className="form-control"
            name="smsMessage"
            rows="3"
            onChange={(e) => setSmsMessage(e.target.value)}
            value={smsMessage}
            placeholder="Type your SMS here..."
          ></textarea>
          {/* Email Input */}
          <input
            type="email"
            className="form-control"
            name="recipientEmail"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            placeholder="Type your Email here..."
          />
        </div>
        
        <div className="form-group">
          <button className="btn" onClick={handleSmsSubmit}>Send SMS</button>
        </div>
      </div>

      {/* Table and Actions */}
      <div>
        <h2 style={{ textAlign: 'center', color: 'Green' }}>Submitted Data</h2>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Gender</th>
              <th>Age</th>
              <th>BirthDay</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {userData.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.phoneNumber}</td>
                <td>{user.gender}</td>
                <td>{user.Age}</td>
                <td>{user.BirthDay}</td>
                <td>
                  <button onClick={() => handleEdit(index)} className="btn btn-primary">Edit</button>
                  <button onClick={() => handleDelete(index)} className="btn btn-danger">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={generatePDF} className="btn btn-info">Generate PDF</button>
        <button onClick={printTable} className="btn btn-success">Print Table</button>
      </div>
    </div>
  );
}

export default App;
