// // // "use strict";
const MISSING_IMAGE_URL = "http://tinyurl.com/missing-tv";
const TVMAZE_API_URL = "http://api.tvmaze.com/";

// // // Functions we gotta make
// // // 1. to search for the show that the user put 
// // // 2. To put the show that the user put in the DOM 
// // // 3. When the user click on submit 
// // // 4. A function to get the info of the episodes
// // // 5. To put the info of the episodes on the DOM  
// // // 6. When the user clicks on get more episodes 

// // const missingImg = "http://tinyurl.com/missing-tv"; 



// // // const $showsList = $("#shows-list");
// // // const $episodesArea = $("#episodes-area");
// // // const $searchForm = $("#search-form");

// // // Given a query string, this will give back an array of matching shows: 
// // // { id, name, summary, image, episodesUrl } 

// // // This function gives us the information from the api 
async function searchShows(query){
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  // map iterates through the parameter we pass in returning us an object of the information we need
  return response.data.map(result => {
    let show = result.show; 
    return {
      id: show.id, 
      name: show.name, 
      summary: show.summary, 
      image: show.image ? show.image.medium : MISSING_IMAGE_URL, 
    };
  });
}


// Ppopulate show is to get the info from searchShows and put it in the DOM 
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary get-episodes">Episodes</button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($item);
  }
}

// this function is to get the episodes info out of the API 
async function getEpisodes(id) {
  let response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);

  let episodes = response.data.map(episode => ({
    id: episode.id,
    name: episode.name,
    season: episode.season,
    number: episode.number,
  }));

  return episodes;
}


// And here we grab that information and we put it in the DOM 
function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
    
  for (let episode of episodes) {
    let $item = $(
      `<li>
         ${episode.name}
         (season ${episode.season}, episode ${episode.number})
       </li>
      `);

    $episodesList.append($item);
  }

  $("#episodes-area").show();
}

// this is the event listener for the episodes button. 
$("#shows-list").on("click", ".get-episodes", async function handleEpisodeClick(evt) {
  let showId = $(evt.target).closest(".Show").data("show-id");
  let episodes = await getEpisodes(showId);
  populateEpisodes(episodes);
});



// // /** Given list of shows, create markup for each and to DOM */




// Here is the event listener for the go button 
$('#search-form').on("submit", async function handleSearch (evt) {
  evt.preventDefault(); 

  let query = $("#search-query").val(); 
  if (!query) return; 

  $("episodes-area").hide(); 

  let shows = await searchShows(query); 

  populateShows(shows); 

})




// ************************************


// 