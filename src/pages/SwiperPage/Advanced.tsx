import React, { type FC, useState, useMemo, useRef } from 'react';
import TinderCard from 'react-tinder-card';

import './Advanced.css';

interface Character {
  name: string;
  url: string;
}

const db: Character[] = [
  {
    name: 'Richard Hendricks',
    url: './img/dinesh.jpg',
  },
  {
    name: 'Erlich Bachman',
    url: './img/dinesh.jpg',
  },
  {
    name: 'Monica Hall',
    url: './img/dinesh.jpg',
  },
  {
    name: 'Jared Dunn',
    url: './img/dinesh.jpg',
  },
  {
    name: 'Dinesh Chugtai',
    url: './img/dinesh.jpg',
  },
];

export const Advanced: FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(db.length - 1);
  const [lastDirection, setLastDirection] = useState<string | undefined>();
  // used for outOfFrame closure
  const currentIndexRef = useRef<number>(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(db.length)
        .fill(0)
        .map(() => React.createRef<any>()),
    []
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < db.length - 1;
  const canSwipe = currentIndex >= 0;

  // set last direction and decrease current index
  const swiped = (direction: string, nameToDelete: string, index: number) => {
    console.log(nameToDelete);
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
  };

  const outOfFrame = (name: string, idx: number) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current?.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < db.length) {
      await childRefs[currentIndex].current?.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current?.restoreCard();
  };

  return (
    <div>
      <link
        href="https://fonts.googleapis.com/css?family=Damion&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Alatsi&display=swap"
        rel="stylesheet"
      />
      <h1>React Tinder Card</h1>
      <div className="cardContainer">
        {db.map((character, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="swipe"
            key={character.name}
            onSwipe={(dir: string) => swiped(dir, character.name, index)}
            onCardLeftScreen={() => outOfFrame(character.name, index)}
          >
            <div
              style={{ backgroundImage: 'url(' + character.url + ')' }}
              className="card"
            >
              <h3>{character.name}</h3>
            </div>
          </TinderCard>
        ))}
      </div>
      <div className="buttons">
        <button
          style={{ backgroundColor: !canSwipe ? '#c3c4d3' : undefined }}
          onClick={() => swipe('left')}
        >
          Swipe left!
        </button>
        <button
          style={{ backgroundColor: !canGoBack ? '#c3c4d3' : undefined }}
          onClick={() => goBack()}
        >
          Undo swipe!
        </button>
        <button
          style={{ backgroundColor: !canSwipe ? '#c3c4d3' : undefined }}
          onClick={() => swipe('right')}
        >
          Swipe right!
        </button>
      </div>
      {lastDirection ? (
        <h2 key={lastDirection} className="infoText">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="infoText">
          Swipe a card or press a button to get Restore Card button visible!
        </h2>
      )}
    </div>
  );
};

export default Advanced;
