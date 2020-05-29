import React from "react";
import Button from "@material-ui/core/Button";

// const checkList = joke => {
//   if (!this.props.regular && this.props.explicit) {
//     if (joke.categories.length === 1 && joke.categories[0] === "explicit")
//       return true;
//     return false;
//   } else if (this.props.regular && !this.props.explicit) {
//     if (joke.categories.length === 0) return true;
//     return false;
//   } else if (this.props.regular && this.props.explicit) {
//     return true;
//   } else {
//     return false;
//   }
// };

class JokesList extends React.Component {
  onLikeClick = id => {
    this.props.onLike(id);
  };

  onUnlikeClick = id => {
    this.props.onUnlike(id);
  };

  render() {
    let renderedList = this.props.slicedJokesList.map(joke => {
      return (
        <div className="joke" key={joke.id}>
          <div className="joke__category">
            {joke.categories.length > 0 ? (
              <p className="joke__category--explicit">{joke.categories[0]}</p>
            ) : (
              <p className="joke__category--regular">regular</p>
            )}
          </div>
          <p className="joke__text">{joke.joke}</p>
          <div className="joke__buttons">
            <Button
              variant="contained"
              color="primary"
              className="buttons like__button"
              disableElevation
              onClick={() => this.onLikeClick(joke.id)}
            >
              Like
            </Button>
            <Button
              color="default"
              variant="contained"
              className="buttons unlike__button"
              disableElevation
              onClick={() => this.onUnlikeClick(joke.id)}
            >
              Unlike
            </Button>
          </div>
        </div>
      );
    });

    return <div className="JokesList">{renderedList}</div>;
  }
}

export default JokesList;
