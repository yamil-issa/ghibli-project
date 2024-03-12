import { GraphQLError } from "graphql";
import { getClosestColor } from "./colors.js";
import { Resolvers, Speciality } from "./types.js";

 
const doctorsData = [
  {
    id: '1',
    name: 'Samia Mekame',
    speciality: Speciality.Ophtalmologist,
  },
  {
    id: '2',
    name: 'Catherine Bedoy',
    speciality: Speciality.Psychologist,
  },
  {
    id: '3',
    name: 'John Doe',
    speciality: Speciality.Ophtalmologist,
  },
];
export const resolvers: Resolvers = {
  Query: {
    doctors: (parent, args, context, info) => {
      const {specialities} = args
      return doctorsData.filter(doctor => specialities.includes(doctor.speciality))
    },
    doctor: (parent, args, context, info) => {
      const id = args.id
      return doctorsData.find(d => d.id === id)
    },
    divide: (parent, args, context, info) => {
      const {number1, number2} = args
      if (number2 === 0) {
        throw new GraphQLError('cannot divide by 0')
      }
      return number1 / number2
    },
    multiply: (parent, args, context, info) => {
      const {number1, number2} = args
      return number1 * number2
    },
    closestColor: (parent, args, context, info) => {
      const {color} = args
      if (!(color.match(/^#[0-9a-fA-F]{6}/))) {
        throw new GraphQLError('color pattern does not match')
      }
      return getClosestColor(color, ["#FF5733", "#33FF57", "#3357FF"])
    },
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

  Doctor: {
    addresses: (parent, args, context, info) => {
      return [{
        zipCode: `${parent.id}000`
      }]
    }
  }
 };
