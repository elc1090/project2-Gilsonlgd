import React, { useState, useEffect } from 'react';

const SearchPlaylists = ({ userName }) => {
  const [playlists, setPlaylists] = useState([]);
  
  useEffect(() => {
    const fetchPlaylists = async () => {
      // Define as credenciais de autenticação
      const clientId = '91f578b4599f454ea3914e927f4e3f3a';
      const clientSecret = '9616f7632a774a0482a584c260b90d52';
      const tokenUrl = 'https://accounts.spotify.com/api/token';

      // Obtém um token de acesso válido da API do Spotify
      const getToken = async () => {
        const response = await fetch(tokenUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
          },
          body: 'grant_type=client_credentials'
        });
        const data = await response.json();
        return data.access_token;
      };
      const accessToken = await getToken();

      // Utiliza o endpoint de pesquisa da API do Spotify para pesquisar as playlists do usuário
      const searchUrl = `https://api.spotify.com/v1/search?q=${encodeURIComponent(userName)}&type=playlist`;
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': 'Bearer ' + accessToken
        }
      });
      const data = await response.json();

      // Extrai as informações relevantes das playlists encontradas
      const playlists = data.playlists.items.map(item => {
        return {
          name: item.name,
          url: item.external_urls.spotify
        };
      });

      // Atualiza o estado com as playlists encontradas
      setPlaylists(playlists);
    };

    fetchPlaylists();
  }, [userName]);

  // Renderiza as playlists encontradas
  return (
    <div>
      <h2 className='text-white'>Playlists de {userName}:</h2>
      <ul>
        {playlists.map(playlist => (
          <li key={playlist.url}><a href={playlist.url} target="_blank" rel="noreferrer">{playlist.name}</a></li>
        ))}
      </ul>
    </div>
  );
};

export default SearchPlaylists;
