import { MovieDBMovieResponse } from "@/infrastructure/interfaces/moviedb-movie.response";
import { abrilApi } from "../../api/movie-api";
import { CompleteMovie } from "@/infrastructure/interfaces/movie.interface";
import { MovieMapper } from "@/infrastructure/mappers/movie.mapper";

export const getMovieByIdAction = async(id:number | string) : Promise<CompleteMovie>=>{

    try {
        
        const {data} = await abrilApi.get<MovieDBMovieResponse>(`/${id}`)
        // console.log('pelicula http cargada')
        return MovieMapper.fromTheMovieDBToCompleteMovie(data)
    } catch (error) {
        console.log(error)
        throw "Cannot load now play movies"
        
    }
}