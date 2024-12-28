import { MovieDBMovieResponse } from "@/infrastructure/interfaces/moviedb-movie.response";
import { movieApi } from "../../api/movie-api";

export const getMovieByIdAction = async(id:number | string)=>{

    try {
        
        const {data} = await movieApi.get<MovieDBMovieResponse>(`/${id}`)
        console.log('data::: ', data);

        
        

        return data
    } catch (error) {
        console.log(error)
        throw "Cannot load now play movies"
        
    }
}