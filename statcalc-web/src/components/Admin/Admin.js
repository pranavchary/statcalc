import React, { useState } from 'react';
import TextInput from '../../common/input/TextInput';
import Button from '../../common/button/Button';

import { loginAdmin } from '../../common/requests';

const buttonStyles = {
  margin: '10px',
  width: '20%'
}

const adminStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
}

const Admin = (props) => {
  const [username, setUsername] = useState('');
  const handleSubmit = async () => {
    let loggedIn = await loginAdmin(username);
    if (loggedIn) {
      props.history.push('/addmon');
    } else {
      setUsername('');
    }
  }
  return (
    <div className="admin" style={adminStyle}>
      <TextInput
        id="username"
        maxLength={25}
        label="Username"
        type="text"
        name="username"
        defaultValue={ username }
        onChange={ (event) => setUsername(event.target.value) }
        onEnter={ () => handleSubmit() }
        width="20%"
      />
      <Button buttonStyles={buttonStyles} text="LOGIN" onClick={ () => handleSubmit() } />
      <Button buttonStyles={buttonStyles} text="BACK" onClick={ () => props.history.goBack() } />
    </div>
  );
}

export default Admin;
