import React from 'react';
import './ShareButton.css'

const ShareButton = ({ params }) => {
  const shareUrl = `${window.location.origin}${window.location.pathname}?${new URLSearchParams(params).toString()}`;

  const handleShare = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('Ссылка скопирована в буфер обмена');
    });
  };

  return (
    <button className='share-btn' onClick={handleShare}>Поделиться</button>
  );
}

export default ShareButton;
