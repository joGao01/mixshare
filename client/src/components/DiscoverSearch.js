import React from 'react';
import { Button, Tabs, Tab } from 'react-bootstrap';
import { FriendListPopup, MyPlaylistsPopup, SearchResultItem } from '.';
import AddIcon from '@material-ui/icons/Add';

// TODO: move to another file
// decodes HTML characters from youtube search results
function decodeHtml(text) {
  var txt = document.createElement('textarea');
  txt.innerHTML = text;
  return txt.value;
}

const DiscoverSearch = (props) => {
  return (
    <div>
      <h5>Search results for: {props.query}</h5>
      <Tabs>
        <Tab eventKey="playlistsSearch" title="Playlists" className="p-3">
          {props.playlistResults.map((p) => {
            return (
              <SearchResultItem key={p.id} name={p.name} artist={p.owner}>
                <MyPlaylistsPopup>
                  <Button variant="flat">
                    <AddIcon style={{ color: '#979696' }} />
                  </Button>
                </MyPlaylistsPopup>

                <FriendListPopup />
              </SearchResultItem>
            );
          })}
        </Tab>
        <Tab eventKey="songsSearch" title="Songs" className="p-3">
          {props.songResults.map((s) => {
            return (
              <SearchResultItem
                key={s.id.videoId}
                youtubeID={s.id.videoId}
                name={decodeHtml(s.snippet.title)}
                artist={s.snippet.channelTitle}
                thumbnail={s.snippet.thumbnails.medium.url}>
                <MyPlaylistsPopup song={s}>
                  <Button variant="flat">
                    <AddIcon style={{ color: '#979696' }} />
                  </Button>
                </MyPlaylistsPopup>

                <FriendListPopup />
              </SearchResultItem>
            );
          })}
        </Tab>
      </Tabs>
    </div>
  );
};

export default DiscoverSearch;
