import logo from './logo.svg';
import './App.css';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

function App({ signOut, user }) {
  // Todo logic here

  return (
    <>
      {/* Add Todo JSX here  */}
      <Heading level={1}>Hello {user.username}</Heading>
      <Button onClick={signOut}>Sign out</Button>
    </>
  );
}

export default withAuthenticator(App);
