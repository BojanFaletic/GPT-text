import React from 'react';

function MainMenu(props) {
  const handlePdfClick = () => {
    console.log('PDF menu clicked');
    // TODO: Handle PDF menu logic
  };

  const handleSearchClick = () => {
    console.log('Search menu clicked');
    // TODO: Handle search menu logic
  };

  const handleChatClick = () => {
    console.log('Chat menu clicked');
    // TODO: Handle chat menu logic
  };

  const handleHistoryClick = () => {
    console.log('History menu clicked');
    // TODO: Handle history menu logic
  };

  const handleLogoutClick = () => {
    console.log('Logout menu clicked');
    // TODO: Handle logout menu logic
    props.onLogout();
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'left' }}>
      <div style={{ border: '1px solid gray', padding: '20px', borderRadius: '10px' }}>
        <h2>Main Menu</h2>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <button id="menu_pdf" onClick={handlePdfClick}>PDF</button>
          <button id="search" onClick={handleSearchClick}>Search</button>
          <button id="menu_chat" onClick={handleChatClick}>Chat</button>
          <button id="menu_history" onClick={handleHistoryClick}>History</button>
          <button id="menu_logout" onClick={handleLogoutClick}>Logout</button>
        </div>
      </div>
    </div>
  );
}

export default MainMenu;