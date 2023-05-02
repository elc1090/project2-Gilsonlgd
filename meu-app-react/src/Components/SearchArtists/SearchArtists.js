import React, { useState, useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { v4 as uuid } from "uuid";

import "./SearchArtists.css";

const SearchArtists = ({ artistName, onClick }) => {
  const [artists, setArtists] = useState([]);
  const [artistsKey, setArtistsKey] = useState(uuid());
  const defaultProfileImg =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  useEffect(() => {
    const fetchArtists = async () => {
      // Define as credenciais de autenticação
      const clientId = "91f578b4599f454ea3914e927f4e3f3a";
      const clientSecret = "9616f7632a774a0482a584c260b90d52";
      const tokenUrl = "https://accounts.spotify.com/api/token";

      // Obtém um token de acesso válido da API do Spotify
      const getToken = async () => {
        const response = await fetch(tokenUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + btoa(clientId + ":" + clientSecret),
          },
          body: "grant_type=client_credentials",
        });
        const data = await response.json();
        return data.access_token;
      };
      const accessToken = await getToken();

      // Utiliza o endpoint de pesquisa da API do Spotify para pesquisar os artistas
      const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(
        artistName
      )}&type=artist`;
      const response = await fetch(searchUrl, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      const data = await response.json();
      console.log(data);

      // Extrai as informações relevantes dos artistas encontrados
      const artists = [...data.artists.items]
      setArtistsKey(uuid());
      setArtists(artists);
    };
    // Atualiza o estado com os artistas encontrados
    setArtists([]);
    fetchArtists();
  }, [artistName]);

  function transformNumber(number) {
    return Number(number).toLocaleString("pt-BR");
  }

  // Renderiza os artistas encontrados
  return (
    <TransitionGroup className="row artists-container">
      {artists.map((artist, index) => (
        <CSSTransition
          key={artistsKey + index}
          classNames={{
            enter: "card-enter",
            exit: "card-leave",
          }}
          timeout={1000}
          addEndListener={(node, done) => {
            node.addEventListener("transitionend", done, false);
          }}
        >
          <div className="col-12 col-md-6 col-lg-4 col-xxl-3" key={artist.url}>
            <div
              className="row artist-card"
              onClick={() => onClick(artist)}
            >
              <div className="d-flex col-12 justify-content-center">
                <img
                  className={`profile-img mt-3 ${
                    !artist.images.length ? "low-brightness" : ""
                  }`}
                  alt="Foto de Perfil do Artista"
                  src={
                    artist.images.length
                      ? artist.images[0].url
                      : defaultProfileImg
                  }
                ></img>
              </div>
              <div className="d-flex col-12 align-items-center flex-column text-white mb-3">
                <h3>{artist.name}</h3>
                <p className="sub-info">
                  {transformNumber(artist.followers.total) + " seguidores"}
                </p>
              </div>
              <div className="d-flex col-12 align-items-center flex-column text-white">
                <h4>Gêneros</h4>
                <p>
                  {artist.genres.length
                    ? artist.genres.slice(0, 2).join(", ")
                    : "none"}
                </p>
              </div>
              <div className="d-flex col-12 align-items-center flex-column text-white">
                <h4>Popularidade</h4>
                <p>{artist.popularity}</p>
              </div>
            </div>
          </div>
        </CSSTransition>
      ))}
    </TransitionGroup>
  );
};

export default SearchArtists;
