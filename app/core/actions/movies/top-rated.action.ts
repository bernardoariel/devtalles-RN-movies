import { MovieDBMoviesResponse } from "@/infrastructure/interfaces/moviedb-response"
import { abrilApi } from "../../api/movie-api"
import { MovieMapper } from "@/infrastructure/mappers/movie.mapper"

interface Options {
    page?: number;
    limit?:number;
}

export const topRatedMoviesAction = async({page=1,limit=10}:Options)=>{

    try {
        
        const {data} = await abrilApi.get<MovieDBMoviesResponse>('/top_rated',{
            params:{
                page:page,
            }
        })

        const movies = data.results.map(MovieMapper.fromTheMovieDBToMovie)
        // console.log('movies::: ', movies);
        

        return movies
    } catch (error) {
        console.log(error)
        throw "Cannot load now play movies"
        
    }
}