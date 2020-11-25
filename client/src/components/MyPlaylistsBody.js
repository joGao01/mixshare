import React, { useContext, useState, useEffect } from 'react';
import Axios from 'axios';

import { Button, Image, Form, Popover, OverlayTrigger } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { Add, DeleteOutline, Edit } from '@material-ui/icons';

import FriendListPopup from './FriendListPopup';
import { UserContext } from '../contexts';

const MyPlaylistsBody = () => {
  const { currentUser } = useContext(UserContext);
  const [listOfPlaylists, updateListOfPlaylists] = useState([]);

  const getPlaylist = async () => {
    try {
      const playlistRes = await Axios.post('/api/playlist/getPlaylist', {
        username: currentUser.username,
      });
      updateListOfPlaylists(playlistRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getPlaylist();
  }, []);

  const NewPlaylistPopup = () => {
    const createPlaylist = async (event) => {
      event.preventDefault();
      const form = event.target;

      if (form.elements.name.value !== '') {
        try {
          const newPlaylistRes = await Axios.post('/api/playlist/newPlaylist', {
            playlistName: form.elements.name.value,
            username: currentUser.username,
          });
          updateListOfPlaylists(listOfPlaylists.concat(newPlaylistRes.data));
        } catch (err) {
          console.log(err.response);
        }
      } else {
        console.log('Playlist name cannot be empty');
      }
    };

    return (
      <Popover id="popover-basic">
        <Popover.Content style={{ textAlign: 'center' }}>
          <Form onSubmit={createPlaylist}>
            <Form.Group>
              <Form.Control name="name" placeholder="Name of Playlist" />
            </Form.Group>
            <Button type="submit">Submit</Button>
          </Form>
        </Popover.Content>
      </Popover>
    );
  };

  const deletePlaylist = async (props) => {
    try {
      console.log(props);
      const playlistRes = await Axios.post('/api/playlist/deletePlaylist', {
        playlistId: props.id,
        username: props.owner,
      });
      updateListOfPlaylists(playlistRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const PlaylistItem = (props) => {
    return (
      <div className="d-flex flex-column border-bottom pb-2 mb-2">
        <div className="d-flex flex-row">
          <h4>{props.name}</h4>
        </div>
        <div className="d-flex flex-row">
          <div className="d-flex flex-row flex-grow-1">
            <Image
              fluid
              style={{ maxWidth: '20vw' }}
              src="https://wp-en.oberlo.com/wp-content/uploads/2019/04/image13-1-1024x576.png"
            />
            <div className="ml-4">
              <p>{props.songs[0]}</p>
              <p>{props.songs[1]}</p>
              <p>{props.songs[2]}</p>
              <p>{props.songs[3]}</p>
              <p>And More...</p>
            </div>
          </div>
          <div className="d-flex flex-row">
            <Button variant="flat">
              <NavLink
                to={{
                  pathname: '/edit',
                  playlistEditorProps: { id: props.id },
                }}>
                <Edit style={{ color: '#979696' }} />
              </NavLink>
            </Button>
            <FriendListPopup />
            <Button variant="flat" onClick={() => deletePlaylist(props)}>
              <DeleteOutline style={{ color: '#979696' }} />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const PlaylistItemList = () => {
    return (
      <>
        {listOfPlaylists.map((p) => {
          return (
            <PlaylistItem
              key={p.playlistId}
              id={p.playlistId}
              name={p.playlistName}
              owner={p.ownerUsername}
              songs={p.songs}></PlaylistItem>
          );
        })}
      </>
    );
  };

  return (
    <>
      <div
        className="d-flex flex-row mb-2"
        style={{ justifyContent: 'space-between' }}>
        <h2 className="col-lg-auto" href="/edit">
          My Playlists
        </h2>
        <div className="d-flex flex-row" style={{ alignItems: 'center' }}>
          <OverlayTrigger
            placement="left"
            delay={{ show: 250, hide: 400 }}
            overlay={NewPlaylistPopup}
            trigger="click">
            <Button variant="flat">
              <Add style={{ color: '#979696', fontSize: 20 }} />
              new playlist
            </Button>
          </OverlayTrigger>
        </div>
      </div>
      <PlaylistItemList />
    </>
  );
};

export default MyPlaylistsBody;
