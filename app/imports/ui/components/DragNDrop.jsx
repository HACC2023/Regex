import React, { useMemo } from 'react';
import { Card } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingTop: '60px',
  paddingBottom: '50px',
  borderWidth: 1,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fbfbfb',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

// This component renders a drag and drop zone for the admin page (DOES NOT CURRENTLY UPLOAD ANYTHING)
const DragNDrop = () => {
  const {
    getRootProps,
    getInputProps,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({ accept: { 'image/*': [] } });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isFocused ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [
    isFocused,
    isDragAccept,
    isDragReject,
  ]);

  return (
    <Card className="my-2 py-3">
      <div {...getRootProps({ style })}>
        <input {...getInputProps()} />
        <p>Click or drop files here to upload (Currently doesn't do anything)</p>
      </div>
    </Card>
  );
};

export default DragNDrop;
