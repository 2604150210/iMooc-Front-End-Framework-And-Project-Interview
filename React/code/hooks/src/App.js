import React, { useState, useContext, useReducer, useEffect } from 'react'

const AppContext = React.createContext({});

const Navbar = () => {
  const { username } = useContext(AppContext);
  return (
    <div className="navbar">
      <p>AwesomeSite</p>
      <p>{username}</p>
    </div>
  );
}

const Messages = () => {
  const { username } = useContext(AppContext)

  return (
    <div className="messages">
      <h1>Messages</h1>
      <p>1 message for {username}</p>
      <p className="message">useContext is awesome!</p>
    </div>
  )
}

// function App() {
//   return (
//     <AppContext.Provider value={{
//       username: 'superawesome'
//     }}>
//       <div className="App">
//         <Navbar/>
//         <Messages/>
//       </div>
//     </AppContext.Provider>
//   );
// }

const myReducer = (state, action) => {
  switch(action.type)  {
    case('countUp'):
      return  {
        ...state,
        count: state.count + 1
      }
    default:
      return  state;
  }
}

// function App() {
//   const [state, dispatch] = useReducer(myReducer, { count:   0 });
//   return  (
//     <div className="App">
//       <button onClick={() => dispatch({ type: 'countUp' })}>
//         +1
//       </button>
//       <p>Count: {state.count}</p>
//     </div>
//   );
// }

// const Person = ({ personId }) => {
//   const [person, setPerson] = useState({});
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setLoading(true); 
//     fetch(`https://api.github.com/users/${personId}`, {
//       mode: 'cors',
//     })
//       .then(response => response.json())
//       .then(data => {
//         setPerson(data);
//         setLoading(false);
//       });
//   }, [personId])

//   if (loading === true) {
//     return <p>Loading ...</p>
//   }

//   return <div>
//     <p>You're viewing: {person.name}</p>
//   </div>
// }

const usePerson = (personId) => {
  const [loading, setLoading] = useState(true);
  const [person, setPerson] = useState({});
  useEffect(() => {
    setLoading(true);
    fetch(`https://api.github.com/users/${personId}`, {
      mode: 'cors',
    })
      .then(response => response.json())
      .then(data => {
        setPerson(data);
        setLoading(false);
      });
  }, [personId]);  
  return [loading, person];
};

const Person = ({personId}) => {
  const [loading, person] = usePerson(personId)
    if (loading === true) {
    return <p>Loading ...</p>
  }

  return <div>
    <p>You're viewing: {person.name}</p>
  </div>
}

function App() {
  const [show, setShow] = useState("jiailing");

  return (
    <div className="App">
      <Person personId={show} />
      <div>
        Show:
        <button onClick={() => setShow("jiailing")}>jiailing</button>
        <button onClick={() => setShow("2604150210")}>2604150210</button>
      </div>
    </div>
  );
}

export default App;
