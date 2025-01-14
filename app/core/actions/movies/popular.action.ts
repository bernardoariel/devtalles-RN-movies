import { MovieDBMoviesResponse } from "@/infrastructure/interfaces/moviedb-response"
import { abrilApi } from "../../api/movie-api"
import { MovieMapper } from "@/infrastructure/mappers/movie.mapper"


export const popularMoviesAction = async()=>{

    try {
        
        const {data} = await abrilApi.get<MovieDBMoviesResponse>('/popular')

        const movies = data.results.map(MovieMapper.fromTheMovieDBToMovie)
        console.log('movies::: ', movies);
        

        return movies
    } catch (error) {
        console.log(error)
        throw "Cannot load now play movies"
        
    }
}