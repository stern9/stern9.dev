import React from "react";
import CardItem from "./CardItem";

function Cards() {
  return (
    <div className="cards">
      <h1>Some of my projects</h1>
      <div className="cards__container">
        <div className="cards__wrapper">
          <ul className="cards__items">
            <CardItem
              src="https://via.placeholder.com/250"
              text="A brief description of this specific project"
              label="Title/Techs"
            />
            <CardItem
              src="https://via.placeholder.com/250"
              text="A brief description of this specific project"
              label="Title/Techs"
            />
            <CardItem
              src="https://via.placeholder.com/250"
              text="A brief description of this specific project"
              label="Title/Techs"
            />
          </ul>
          <ul className="cards__items">
            <CardItem
              src="https://via.placeholder.com/250"
              text="A brief description of this specific project"
              label="Title/Techs"
            />
            <CardItem
              src="https://via.placeholder.com/250"
              text="A brief description of this specific project"
              label="Title/Techs"
            />
            <CardItem
              src="https://via.placeholder.com/250"
              text="A brief description of this specific project"
              label="Title/Techs"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Cards;
