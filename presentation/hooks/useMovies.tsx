import { nowPlayingAction } from "@/app/core/actions/movies/now-playing.action"
import { popularMoviesAction } from "@/app/core/actions/movies/popular.action"
import { topRatedMoviesAction } from "@/app/core/actions/movies/top-rated.action"
import { upcomingMoviesAction } from "@/app/core/actions/movies/upcoming.action"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"


export const useMovies = () =>{

    const nowPlayingQuery = useQuery({ 
        queryKey: ['movies','nowPlaying'], 
        queryFn: ()=>nowPlayingAction(),
        staleTime: 1000*60*60*24 // por 24hs
    })
    const popularQuery = useQuery({ 
        queryKey: ['movies','popular'], 
        queryFn: ()=>popularMoviesAction(),
        staleTime: 1000*60*60*24 // por 24hs
    })
    const topRatedQueryQuery = useInfiniteQuery({ 
        initialPageParam:1,
        queryKey: ['movies','top-rated'], 
        queryFn: ({pageParam})=>{
            // console.log({pageParam});
            return topRatedMoviesAction({page:pageParam})
        },
        staleTime: 1000*60*60*24, // por 24hs
        getNextPageParam:(_,pages)=> pages.length +1
    })
    const upcomingQuery = useQuery({ 
        queryKey: ['movies','upcoming'], 
        queryFn: ()=>upcomingMoviesAction(),
        staleTime: 1000*60*60*24 // por 24hs
    })

    return {
        nowPlayingQuery,
        popularQuery,
        topRatedQueryQuery,
        upcomingQuery
    }
}