import { useEffect, useState } from 'react'

const CatInfo = (props) => {
  return (
    <>
      <div className="info-container">
        {props.list.map((attribute, index) => (
          <button key={index} onClick={() => props.banAttr(attribute)}>{attribute}</button>
        ))}
      </div>
      <p>{props.name}</p>
      <div className="img-container">
        <img src={props.img}></img>
      </div>
    </>
  )
}

const FilterAttributes = (props) => {
  return (
    <>
    <div className="filtered-container">
      {props.list.map((attribute, index) => (
        <button key={index} onClick={() => props.removeAttr(attribute)}>{attribute}</button>
      ))}
    </div>
    </>
  )
}

const History = (props) => {
  return (
    <>
      <div className="history-container" style={{
        maxHeight: '600px',
        overflowY: 'auto',
        padding: '10px'
      }}>
        {props.history.length === 0 ? (
          <p>No cats viewed yet</p>
        ) : (
          props.history.map((cat, index) => (
            <div key={index} className="history-item">
              <img src={cat.img} alt={cat.name} style={{width: '100px', height: '100px', objectFit: 'cover'}} />
              <p>{cat.name}</p>
            </div>
          ))
        )}
      </div>
    </>
  )
}

const Cats = () => {
  const [bannedAttr, setBannedAttr] = useState([]);
  const [attributes, setAttr] = useState([]);
  const [name, setName] = useState('');
  const [catImg, setCatImg] = useState('');
  const [history, setHistory] = useState([]);

  const addToBanned = (attribute) => {
    if (!bannedAttr.includes(attribute)) {
      setBannedAttr([...bannedAttr, attribute]);
    }
    console.log(bannedAttr);
  }

  const removeBanned = (attribute) => {
    setBannedAttr(bannedAttr.filter(attr => attr !== attribute));
  }

  const addToHistory = (catData) => {
    setHistory([catData, ...history]);
  }

  const callAPI = async (query) => {
    try {
      const response = await fetch(query);
      const json = await response.json();

      const data = json[0];
      const attr = data.breeds[0];

      if ( (bannedAttr.includes(attr.life_span)) || (bannedAttr.includes(attr.origin)) || (bannedAttr.includes(attr.weight.imperial)) ) {
        callAPI(query).catch(console.error);
      } else {
        setCatImg(data.url);
        setAttr([attr.life_span, attr.origin, attr.weight.imperial])
        setName(attr.name)
        
        // Add to history
        addToHistory({
          name: attr.name,
          img: data.url,
          attributes: [attr.life_span, attr.origin, attr.weight.imperial]
        });
      }

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const API_KEY = "live_5sWyrZ7EMlaF30lNO6L5nUd6uuiLF1rGbpiqTttJBjYMZ2D04KTGH3osWSktSyZU";
    let url = `https://api.thecatapi.com/v1/images/search?limit=1&has_breeds=1&api_key=${API_KEY}`;
    callAPI(url).catch(console.error);
  }, [])

  const handleDiscoverClick = () => {
    const API_KEY = "live_5sWyrZ7EMlaF30lNO6L5nUd6uuiLF1rGbpiqTttJBjYMZ2D04KTGH3osWSktSyZU";
    let url = `https://api.thecatapi.com/v1/images/search?limit=1&has_breeds=1&api_key=${API_KEY}`;

    callAPI(url).catch(console.error);

    console.log(bannedAttr.includes(attributes[0]), (bannedAttr.includes(attributes[1])), (bannedAttr.includes(attributes[2])), attributes)
  }
  
  return (
  <>
    <div className="cat-info-container" style={{display: 'flex', gap: '20px', justifyContent: 'space-between'}}>
      <div style={{flex: 1}}>
        <h2>Who have we seen so far?</h2>
        <History history={history} />
      </div>

      <div style={{flex: 1}}>
        <h2>Find Your Cat</h2>
        <p>Discover New Breeds of Cats</p>
        <CatInfo list={attributes} name={name} img={catImg} banAttr={addToBanned}/>
        <div className='discover-button-container'>
          <button className="discover-button" onClick={handleDiscoverClick}>Discover</button>
        </div>
      </div>

      <div style={{flex: 1}}>
        <h2>Ban List</h2>
        <FilterAttributes list={bannedAttr} removeAttr={removeBanned}/>
      </div>
    </div>
  </>
  )
}

export default Cats