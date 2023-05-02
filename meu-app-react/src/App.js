import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import IconButton from "./Components/IconButton/IconButton";
import BaseInput from "./Components/BaseInput/BaseInput";
import SearchArtists from "./Components/SearchArtists/SearchArtists";

function App() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [artistName, setArtistName] = useState(
    state?.artistName ? state.artistName : "Ariana Grande"
  );

  const [searchValue, setSearchValue] = useState(artistName);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function loadArtists() {
    setArtistName(searchValue);
  }

  function handleSelectArtist(artist) {
    navigate(`/artist/${artist.id}`, {
      state: { ...artist, searchValue: String(searchValue) },
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="d-flex inline-block row">
          <h1 className="text-lg opacity-enter">Spotify</h1>
        </div>
        <div className="row mt-2">
          <div className="d-flex col-12 justify-content-center opacity-enter">
            <BaseInput
              value={searchValue}
              setValue={setSearchValue}
              placeholder={"Pesquise um artista"}
            />
            <div className="green-spotify teste mt-2">
              <IconButton icon={"fas fa-arrow-right"} onClick={loadArtists} />
            </div>
          </div>
        </div>
      </header>

      <div className="App-body">
        <div className="row">
          <div className="col-12 body-title opacity-enter">
            <h2>Artistas encontrados:</h2>
          </div>
        </div>
        <div className="d-flex justify-content-center mt-4">
          <SearchArtists artistName={artistName} onClick={handleSelectArtist} />
        </div>
      </div>
    </div>
  );
}

export default App;
