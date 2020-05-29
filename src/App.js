import React from "react";
import InfiniteScroll from "react-infinite-scroll-component";

import "./App.css";
import JokesList from "./JokesList";
import AppBar from "@material-ui/core/AppBar";
import { Tabs, Tab } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import LikedJokesList from "./LikedJokesList";
import ExplicitJokesList from "./ExplicitJokesList";
import NerdyJokesList from "./NerdyJokesList";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      jokesList: [],
      slicedJokesList: [],
      nerdyJokesList: [],
      explicitJokesList: [],
      likedJokes: [],
      tab: 0,
      hasMore: true,
      toShow: "0",
    };
  }

  getJokesList = async () => {
    let response = await fetch("https://api.icndb.com/jokes");
    let data = await response.json();
    this.setState({ jokesList: data.value });
    this.setState({ slicedJokesList: data.value.slice(0, 10) });
  };

  getNerdyJokesList = async () => {
    let response = await fetch("https://api.icndb.com/jokes/?limitTo=[nerdy]");
    let data = await response.json();
    this.setState({ nerdyJokesList: data.value });
  };

  getExplicitJokesList = async () => {
    let response = await fetch(
      "https://api.icndb.com/jokes/?limitTo=[explicit]"
    );
    let data = await response.json();

    this.setState({ explicitJokesList: data.value });
  };

  componentDidMount() {
    this.getJokesList();
    this.getNerdyJokesList();
    this.getExplicitJokesList();
  }

  onLike = id => {
    if (this.state.likedJokes.some(joke => joke.id === id)) return;
    this.setState({
      likedJokes: [
        ...this.state.likedJokes,
        this.state.jokesList.find(joke => joke.id === id),
      ],
    });
  };

  onUnlike = id => {
    this.setState({
      likedJokes: this.state.likedJokes.filter(joke => joke.id !== id),
    });
  };

  onHomeClick = () => {
    this.setState({ tab: 0 });
  };

  onLikesClick = () => {
    this.setState({ tab: 1 });
  };

  fetchMoreData = () => {
    if (this.state.slicedJokesList.length >= this.state.jokesList) {
      this.setState({ hasMore: false });
      return;
    }

    setTimeout(() => {
      this.setState({
        slicedJokesList: this.state.jokesList.slice(
          0,
          this.state.slicedJokesList.length + 10
        ),
      });
    }, 500);
  };

  displayList = () => {
    if (this.state.toShow === "0") {
      return (
        <InfiniteScroll
          dataLength={this.state.slicedJokesList.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<h4 style={{ textAlign: "center" }}>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          <JokesList
            onLike={this.onLike}
            onUnlike={this.onUnlike}
            slicedJokesList={this.state.slicedJokesList}
          />
        </InfiniteScroll>
      );
    }

    if (this.state.toShow === "1") {
      return (
        <ExplicitJokesList
          onLike={this.onLike}
          onUnlike={this.onUnlike}
          explicitJokesList={this.state.explicitJokesList}
        />
      );
    }

    if (this.state.toShow === "2") {
      return (
        <NerdyJokesList
          onLike={this.onLike}
          onUnlike={this.onUnlike}
          nerdyJokesList={this.state.nerdyJokesList}
        />
      );
    }
  };

  render() {
    return (
      <div className="App">
        <h1 className="app__heading">Chuck Norris Jokes</h1>
        <AppBar position="sticky" className="Appbar">
          <Tabs value={this.state.tab} centered>
            <Tab label="Home" onClick={this.onHomeClick} />
            <Tab label="Likes" onClick={this.onLikesClick} />
          </Tabs>
        </AppBar>
        <div className="radio__buttons">
          <RadioGroup
            aria-label="gender"
            name="gender1"
            value={this.state.toShow}
            onChange={e => this.setState({ toShow: e.target.value })}
            row
          >
            <FormControlLabel value="0" control={<Radio />} label="All" />
            <FormControlLabel value="1" control={<Radio />} label="Explicit" />
            <FormControlLabel value="2" control={<Radio />} label="Nerdy" />
          </RadioGroup>
        </div>
        <Box hidden={this.state.tab !== 0}>{this.displayList()}</Box>
        <Box hidden={this.state.tab !== 1}>
          <LikedJokesList
            likedJokesList={this.state.likedJokes}
            onLike={this.onLike}
            onUnlike={this.onUnlike}
          />
        </Box>
      </div>
    );
  }
}

export default App;
