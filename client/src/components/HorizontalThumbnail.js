import React from 'react';
import { Image } from 'react-bootstrap';

const HorizontalThumbnail = () => {
  return (
    <div style={{ minWidth: '50vw' }} className="d-flex flex-row">
      <div style={{ maxWidth: '15vw' }}>
        <Image
          fluid
          src="https://wp-en.oberlo.com/wp-content/uploads/2019/04/image13-1-1024x576.png"
        />
      </div>

      <div className="ml-3 align-self-top">
        <p>
          Name of Playlist <br />
          [Creator]
        </p>
      </div>
    </div>
  );
};

export default HorizontalThumbnail;
