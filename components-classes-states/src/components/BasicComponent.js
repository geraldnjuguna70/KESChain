import React from 'react';

//function basic component to display how components are created
function BasicComponent() {
  return (
    <div>
      <h1>Hello, Victor Paul!</h1>
      <p>This is a basic React component.</p>
      <SecondComponent />
      <ThirdComponent />
    </div>
  )
}

//function second component to be called in the first component(basic component)
function SecondComponent() {
  return (
    <div>
      <h1>Hello, Second Component!</h1>
      <p>This is a second React component.</p>
    </div>
  )
}

//arrow function component to be called in the first component(basic component)
const ThirdComponent = () => {
  return (
    <div>
      <h1>Hello, Third Component!</h1>
      <p>This is a third React component.</p>
    </div>
  )
}

export default BasicComponent;
