const fetch_url = window.location.search;
const embed_parameter = new URLSearchParams(fetch_url);
const fetch_id_parameter = embed_parameter.get("id");

// re-direct the user back to the main page if ID is invalid
if (!fetch_id_parameter) window.location.href = "index.html";

(async function () {
  try {
    await fetch(
      `https://rickandmortyapi.com/api/character/${fetch_id_parameter}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("error 404");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        const character_data = {
          name: data.name,
          species: data.species,
          origin: data.origin.name,
          location: data.location.name,
          status: data.status,
          gender: data.gender,
          image: data.image,
          episodes: data.episode,
        };
        display_character(character_data);
      })
      .catch((error) => {
        console.error("you have an error!", error);
      });
  } catch (error) {
    console.error("error", error);
  }
})();

function display_character(character) {
  const char_image = document.querySelector("#character_image");
  const char_name = document.querySelector(".character_modal_name");
  const char_species = document.querySelector(".character_modal_species");
  const char_origin = document.querySelector(".character_modal_origin");
  const char_location = document.querySelector(".character_modal_location");
  const char_status = document.querySelector(".character_modal_status");
  const char_gender = document.querySelector(".character_modal_gender");
  const char_episodes = document.querySelector("#episodes_list");

  // name the page title after the character
  document.querySelector("title").textContent = character.name;
  char_image.src = character.image;
  char_name.textContent = character.name;
  char_species.textContent = character.species;
  char_origin.textContent = character.origin;
  char_location.textContent = character.location;
  char_status.textContent = character.status;
  char_gender.textContent = character.gender;

  character.episodes.forEach((e) => {
    const ep = document.createElement("li");
    ep.innerHTML = `<a href="${e}">${e}</a>`;
    char_episodes.appendChild(ep);
  });
}
