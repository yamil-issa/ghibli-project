// Types from the REST API
export type FilmModel = {
  id: string;
  title: string;
  original_title: string;
  original_title_romanised: string;
  description: string;
  director: string;
  producer: string;
  release_date: string;
  running_time: string;
  rt_score: string;
  people: string[];
  species: string[];
  locations: string[];
  vehicles: string[];
  url: string;
  
}

export type PeopleModel = {
  id: string;
  name: string;
  gender: string;
  eye_color: string;
  hair_color: string;
  photo: string;
  films: string[];
  species: string;
  url: string;

}