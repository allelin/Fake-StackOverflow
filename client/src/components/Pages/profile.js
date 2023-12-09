
import React from 'react';

export default function Profile(props) {
    return (
        <div className="profile-page">
            <h1>Profile Page</h1>
            <div className="profile-field">
                <label className="profile-label">Name:</label>
                {/* <span className="profile-value">{account.name}</span> */}
            </div>
            <div className="profile-field">
                <label className="profile-label">Email:</label>
                {/* <span className="profile-value">{account.email}</span> */}
            </div>
            <div className="profile-field">
                <label className="profile-label">Username:</label>
                {/* <span className="profile-value">{account.username}</span> */}
            </div>
            {/* Add more fields from the account schema as needed */}
        </div>
    );
}