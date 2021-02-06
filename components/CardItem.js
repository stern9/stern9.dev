import React from "react";

function CardItem(props) {
  return (
    <div>
      <li className="cards__item">
        <div className="cards__item__link" to={props.path}>
          <figure className="cards__item__pic-wrap" data-category={props.label}>
            <img src={props.src} alt="Alt" className="cards__item__img" />
          </figure>
          <div className="cards__item__info">
            <h5>{props.text}</h5>
          </div>
          <button>Demo</button>
          <button>Code</button>
        </div>
      </li>
    </div>
  );
}

export default CardItem;
