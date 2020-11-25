import React, { useContext } from 'react';
import { Image } from 'react-bootstrap';

import { CurrentlyPlayingContext } from '../contexts';

const defaultThumbnail =
  'https://wp-en.oberlo.com/wp-content/uploads/2019/04/image13-1-1024x576.png';

const Thumbnail = (props) => {
  const { currentlyPlaying, setCurrentlyPlaying } = useContext(
    CurrentlyPlayingContext
  );
  const currentlyPlayingCopy = { ...currentlyPlaying };

  return (
    <div className="d-flex flex-column mr-4">
      <Image
        fluid
        style={{ maxWidth: '19vw', cursor: 'pointer' }}
        src={props.thumbnail != null ? props.thumbnail : defaultThumbnail}
        onClick={() => {
          console.log(props.ytID);
          currentlyPlayingCopy.song = props.ytID;
          setCurrentlyPlaying(currentlyPlayingCopy);
        }}
      />
      <p>
        {props.name} <br /> {props.artist}
      </p>
    </div>
  );
};

export default Thumbnail;
