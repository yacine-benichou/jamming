import React, { useState } from 'react';
import './App.css';
import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        // {id: 1, name: 'Shape of you', artist: 'Ed Sheeran', album: "Don't know"},
        // {id: 2, name: 'Database', artist: 'Man with a mission', album: "heh"},
        // {id: 3, name: 'RESISTER', artist: 'ASCA', album: "SAO Alicization"},
        // {id: 4, name: 'Adamas', artist: 'LISA', album: 'SAO Alicization'},
      ],
      playlistName: 'New Playlist',
      playlistTracks: [
        // {id: 4, name: 'Adamas', artist: 'LISA', album: 'SAO Alicization'},
        // {id: 5, name: 'GIRI GIRI', artist: 'Masayuki Suzuki', album: 'Love is War S3'},
        // {id: 6, name: 'DADDY ! DADDY ! DO !', artist: 'Masayuki Suzuki', album: 'Love is War S2'},
      ]
    }

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    if (this.state.playlistTracks.some(playlistTrack => track.id === playlistTrack.id)) {
      return;
    }
    const newPlaylistTracks = this.state.playlistTracks;
    newPlaylistTracks.push(track);
    this.setState({
      playlistTracks: newPlaylistTracks
    });
  }

  removeTrack(track) {
    const { playlistTracks } = this.state;
    this.setState({
      playlistTracks: playlistTracks.filter(playlistTrack => track.id !== playlistTrack.id)
    });
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    })
  }

  savePlaylist() {
    const trackURIs = this.state.playlistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      })
    })
  }

  search(searchTerm) {
    Spotify.search(searchTerm).then(searchResults => {
      const filteredResponse = searchResults.filter(searchResult => {
        return !this.state.playlistTracks.some(track => track.id === searchResult.id);
      });
      return filteredResponse;
    }).then(filteredResponse => {
      this.setState({
        searchResults: filteredResponse
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} 
              playlistTracks={this.state.playlistTracks} 
              onRemove={this.removeTrack}
              onNameChange={this.updatePlaylistName}
              onSave={this.savePlaylist} />
          </div>
        </div>
      </div>
    );
  }
}
