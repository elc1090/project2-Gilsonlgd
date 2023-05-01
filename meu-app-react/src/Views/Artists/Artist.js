import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import axios from "axios";
import IconButton from "../../Components/IconButton/IconButton";
import "./Artist.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";

function Artist() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [artistInfos, setArtistInfos] = useState({});
  const [isMounted, setIsMounted] = useState(false);
  const artist = state;

  useEffect(() => {
    const fetchArtist = async () => {
      // Define as credenciais de autenticação
      const clientId = "91f578b4599f454ea3914e927f4e3f3a";
      const clientSecret = "9616f7632a774a0482a584c260b90d52";
      const tokenUrl = "https://accounts.spotify.com/api/token";

      const LASTFM_API_KEY = "3b07a72c43a1e0709fb61d5f90a2bc8f";
      const LASTFM_API_BASE_URL = "http://ws.audioscrobbler.com/2.0/";

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
      let searchUrl = `https://api.spotify.com/v1/artists/${artist.id}/related-artists`;
      let response = await fetch(searchUrl, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      let data = await response.json();
      const relatedArtists = data.artists;

      // Utiliza o endpoint de pesquisa da API do Spotify para pesquisar os artistas
      searchUrl = `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=BR`;
      response = await fetch(searchUrl, {
        headers: {
          Authorization: "Bearer " + accessToken,
        },
      });
      data = await response.json();
      console.log(data);
      const topTracks = data.tracks;

      const fetchArtistInfo = async () => {
        const response = await axios.get(LASTFM_API_BASE_URL, {
          params: {
            method: "artist.getinfo",
            artist: artist.name,
            lang: "pt",
            api_key: LASTFM_API_KEY,
            format: "json",
          },
        });
        return response.data;
      };

      const infos = await fetchArtistInfo();
      setArtistInfos({
        infos: infos,
        relatedArtists: relatedArtists,
        topTracks: topTracks,
      });
      setIsMounted(true);
    };
    // Atualiza o estado com os artistas encontrados
    fetchArtist();
  }, []);

  function loadArtist() {}

  function handleSelectArtist(artist) {}

  function handleDirectHome(artistToRedirect) {
    console.log("aqui");
    navigate("/", { state: { artistName: artistToRedirect } });
  }

  function transformNumber(number) {
    return Number(number).toLocaleString("pt-BR");
  }

  function getArtistBio(bio) {
    if (!bio) return "Biografia não disponível";
    bio = bio.replace(/(?<!feat)\./g, "\n");

    // Divida a bio em substrings com base na quebra de linha
    const substrings = bio.split("\n");

    // Obtenha as primeiras quatro substrings e junte-as novamente com um ponto e espaço
    const shortenedBio = substrings.slice(0, 7).join(". ") + ".";
    return shortenedBio;
  }

  function getFormatedDuration(duration_ms) {
    const duration = moment.duration(duration_ms);
    const minutes = duration.minutes().toString().padStart(2, "0");
    const seconds = duration.seconds().toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  }

  return (
    <div className="Artist">
      <header
        className="Artist-header"
        style={{
          backgroundImage: ` ${
            artist.images[0]
              ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.9)), url(${artist.images[0].url})`
              : "linear-gradient(to bottom, #1db954, #282c34)"
          }`,
        }}
      >
        <div className="home-btn green-spotify">
          <IconButton
            icon={"fas fa-arrow-left fa-xl"}
            onClick={() => handleDirectHome(artist.searchValue)}
          />
        </div>
        <div className="d-flex inline-block row">
          <h1 className="header-title text-md">{artist.name} </h1>
        </div>
        <div className="row mt-2">
          <div className="d-flex col-12">
            <h3 className="header-subtitle">{`${transformNumber(
              artist.followers
            )} seguidores`}</h3>
          </div>
        </div>
      </header>

      <div className="Artist-body">
        {isMounted ? (
          <div className="full-width">
            <div className="row">
              <div className="col-12 mb-4">
                <div className="info-container text-white">
                  <h3>Top Tracks no Brasil</h3>
                  {artistInfos.topTracks.slice(0, 5).map((track, index) => (
                    <div className="track-container" key={track.id}>
                      <span className="index-box">{index + 1}</span>
                      <span className="image-box">
                        {" "}
                        <img src={track.album.images[0].url}></img>
                      </span>
                      <span className="name-box">{track.name}</span>
                      <span className="album-box d-none d-lg-block">
                        {track.album.name}
                      </span>
                      <span className="duration-box sub-info d-none d-md-block">
                        {getFormatedDuration(track.duration_ms)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div></div>

            <div className="row">
              <div className="col-12 col-lg-6 mb-4">
                <div className="info-container text-white">
                  <h3>Stats</h3>
                  <h5>
                    <span className="number-box green-spotify">
                      {transformNumber(
                        artistInfos.infos?.artist.stats.playcount
                      )}
                    </span>{" "}
                    <span>{`plays`}</span>
                  </h5>
                  <h5>
                    <span className="number-box green-spotify">
                      {transformNumber(
                        artistInfos.infos?.artist.stats.listeners
                      )}
                    </span>{" "}
                    <span className="align-text-right">{`ouvintes mensais`}</span>
                  </h5>
                </div>
              </div>
              <div className="col-12 col-lg-6">
                <div className="info-container text-white">
                  <h3>Biografia</h3>
                  <p className="text">
                    {getArtistBio(artistInfos.infos?.artist.bio.content)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default Artist;
