import { useState, useEffect } from "react";

// json-server --watch identity.json --port 5000

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
      .then((res) => {
        return res.json();
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
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setDataRefresh(!dataRefresh);
      });
  };

  const handleUpdate = (e) => {
    const updateId = e.target.value;
    const updateData = movieStars.find((star) => star.id === +updateId);

    const updatedValue = prompt(
      `Update movie for ${updateData.fullname}`,
      updateData.movie
    );
    if (updatedValue !== null) {
      const options = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ movie: updatedValue }),
      };

      fetch(`http://localhost:5000/identity/${updateId}`, options)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          setMovieStars(
            movieStars.map((star) =>
              star.id === +updateId ? { ...star, movie: data.movie } : star
            )
          );
        });
    }
  };

  const movieStar = movieStars.map((identity, index) => {
    return (
      <div key={index}>
        <li>
          {identity.fullname} - {identity.movie}
        </li>
        <button onClick={handleDelete} value={identity.id}>
          Delete Superstar
        </button>
        <button onClick={handleUpdate} value={identity.id}>
          Update Superstar
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
