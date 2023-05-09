import { useState, useEffect } from "react";

function App() {
  const [movieStars, setMovieStars] = useState([]);
  const [dataRefresh, setDataRefresh] = useState(false);

  useEffect(() => {
    fetch("http://localhost:5000/identity")
      .then((res) => res.json())
      .then((data) => {
        setMovieStars(data);
      });
  }, [dataRefresh]);

  // Handle Form Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    const fullname = e.target[0].value;
    const movie = e.target[1].value;

    const newMovieStar = {
      fullname,
      movie,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newMovieStar),
    };

    // Post Form Data to JSON Server
    fetch("http://localhost:5000/identity", options)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        setMovieStars([...movieStars, data]);
      });

    e.target[0].value = "";
    e.target[1].value = "";
  };

  const handleDelete = (e) => {
    const starId = e.target.value;
    const options = {
      method: "DELETE",
    };

    fetch(`http://localhost:5000/identity/${starId}`, options)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        setDataRefresh(!dataRefresh);
      });
  };

  // const handleUpdate = (message, value) => {
  //   const newIdentities = identities.map((item) => {
  //     if (item === message) {
  //       return {
  //         ...item,
  //         heard: value,
  //       };
  //     } else {
  //       return item;
  //     }
  //   });

  //   setMovieStars(newIdentities);
  // };

  const movieStar = movieStars.map((identity, index) => {
    return (
      <div key={index}>
        <li>
          {identity.fullname} - {identity.movie}
        </li>
        <button onClick={handleDelete} value={identity.id}>
          Delete Superstar
        </button>
      </div>
    );
  });

  return (
    <div>
      <h1>Name of movie stars</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fullname">First name?</label>
        <br />
        <input id="fullname" type="text" />
        <br />
        <br />

        <label htmlFor="movie">Movie name?</label>
        <br />
        <input id="surname" type="text" />
        <br />
        <br />

        <button>Submit</button>
      </form>
      <ul>{movieStar}</ul>
    </div>
  );
}

export default App;
