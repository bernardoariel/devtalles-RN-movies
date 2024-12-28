import { MovieDBMoviesResponse } from "@/infrastructure/interfaces/moviedb-response"
import { movieApi } from "../../api/movie-api"
import { MovieMapper } from "@/infrastructure/mappers/movie.mapper"


export const nowPlayingAction = async()=>{

    try {
        
        const {data} = await movieApi.get<MovieDBMoviesResponse>('/now_playing')

        const movies = data.results.map(MovieMapper.fromTheMovieDBToMovie)
        console.log('movies::: ', movies);
        

        return movies
    } catch (error) {
        console.log(error)
        throw "Cannot load now play movies"
        
    }
}