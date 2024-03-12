import { Resolvers } from "./types.js";

export const resolvers: Resolvers = {
  Query: {
    getFilms: async (parent, args, context, info) => {
      const films = await context.dataSources.trackApi.getFilms()
      const mappedFilms = films.map(film => {

        return {
          ...film,
          id: film.id || null,
        };
      });
      const filteredFilm = mappedFilms.filter(film => film.id !== null);
      return filteredFilm;
    },

    getPeople: async (parent, args, context, info) => {
      const people = await context.dataSources.trackApi.getPeople();
      const mappedPeople = people.map(person => {

        return {
          ...person,
          eyeColor: person.eye_color || null,
        };
      });
      const filteredPeople = mappedPeople.filter(person => person.eyeColor !== null);
      return filteredPeople;
    }
  },

  Film: {
    people: async (parent, args, context, info) => {
      const peoplePromises = parent.people.map(personUrl => {
        if (!personUrl) return null;
        const id = personUrl.substring(personUrl.lastIndexOf('/') + 1);
        return context.dataSources.trackApi.getPeopleById(id);
      });
  
      const people = await Promise.all(peoplePromises);
      const mappedPeople = people
        .filter(person => person !== null) 
        .map(person => ({
          ...person,
          eyeColor: person.eye_color || null,
        }));
      return mappedPeople;
    }
  },

  People: {
    films: async (parent, args, context, info) => {
      const filmPromises = parent.films.map(filmUrl => {
        if (!filmUrl) return null;
        const id = filmUrl.substring(filmUrl.lastIndexOf('/') + 1);
        return context.dataSources.trackApi.getFilmById(id);
      });
  
      const film = await Promise.all(filmPromises);
      const mappedFilm = film
        .filter(film => film !== null) 
        .map(film => ({
          ...film,
          id: film.id || null,
        }));
      return mappedFilm;
    }
  },
 };
