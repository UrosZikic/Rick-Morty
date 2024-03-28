// connect DOM
const search_input = document.getElementById("search");
const results_container = document.getElementById("results");

// pass 1st page onLoad
let current_page = 1;

// Call API on load
window.addEventListener("load", () => fetch_data(current_page, null));

// Async
async function fetch_data(page_num, char_name) {
  const name_param = char_name ? char_name : null;
  // default url
  let final_param =
    "https://rickandmortyapi.com/api/character/?page=" + page_num;

  // append input value if it exists
  final_param += name_param ? `&name=${name_param}` : "";

  try {
    await fetch(final_param)
      .then((response) => {
        if (!response.ok) {
          throw new Error("error 404" + response.status);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        localStorage.setItem("max_page", data.info.pages);
        localStorage.setItem("name_param", name_param);
        display(data);
      })
      .catch((error) => {
        console.error("you have an error!", error);
      });
  } catch (error) {
    console.error("error", error);
  }
}

function display(data) {
  if (current_page === 1) {
    while (results_container.firstChild) {
      results_container.removeChild(results_container.firstChild);
    }
  }

  for (let i = 0; i < data.results.length; i++) {
    // create HTML for API info
    const character_container = document.createElement("div");
    const character_image = document.createElement("img");
    const character_info_container = document.createElement("div");
    const character_name = document.createElement("strong");
    const character_info_table = document.createElement("table");

    // embed data to generated html
    character_image.src = data.results[i].image;
    character_image.alt = data.results[i].name;
    character_name.textContent = data.results[i].name;
    // embed data to variables
    const character_species = data.results[i].species;
    const character_origin = data.results[i].origin.name;
    const character_location = data.results[i].location.name;
    const character_id = data.results[i].id;
    character_container.dataset.target_name = character_name.textContent;

    // create a character info table
    character_info_table.innerHTML = `
      <thead> 
       <tr> 
        <th>Species</th>
        <th>Origin</th>
        <th>Location</th>
       </tr>
      </thead>
      <tbody> 
       <td>
        ${character_species}
       </td>
       <td>
        ${character_origin}
       </td>
       <td>
        ${character_location}
       </td>
      </tbody>
    `;
    // separate info from the image
    character_info_container.append(character_name, character_info_table);
    // append to the primary character container
    character_container.append(character_image, character_info_container);
    // add a class to the container
    character_container.classList.add("character_container");
    character_container.addEventListener(
      "click",
      () => (window.location.href = `character_page.html?id=${character_id}`)
    );
    //append the result to results container
    results_container.appendChild(character_container);
  }
}

results_container.addEventListener("scroll", pagination);

function pagination() {
  if (
    results_container.clientHeight + results_container.scrollTop >=
    results_container.scrollHeight
  ) {
    if (current_page < localStorage.getItem("max_page")) {
      current_page++;
      fetch_data(current_page, search_input.value);
    }
  }
}

search_input.addEventListener("keyup", () => {
  // move back to the top on new input
  results_container.scrollTo(0, 0);
  current_page = 1;
  // get default results if no input else return input results
  if (search_input.value.trim() === "") {
    fetch_data(current_page, null);
  } else {
    fetch_data(current_page, search_input.value);
  }
});
