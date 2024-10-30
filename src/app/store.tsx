import { makeAutoObservable, runInAction } from "mobx";
import { MovieResponse } from "../type/type";

class MoviesStore {
    data: MovieResponse | null = null;
    dataloading: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    async fetchMovies(url: string) {
        runInAction(() => {
            this.dataloading = true;
            this.data = null;
        });

        const fetchedData = await fetch(url);
        const result = await fetchedData.text();
        const jsonLdMatch = result.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        if (jsonLdMatch && jsonLdMatch[1]) {
            const jsonData = jsonLdMatch[1];
            const parsedData = JSON.parse(jsonData);
            runInAction(() => {
                this.data = parsedData as MovieResponse;
            });
        }
        runInAction(() => {
            this.dataloading = false;
        });
    }

    removeItem(index: number) {
        if (this.data) {
            this.data.itemListElement.splice(index, 1);
        }
    }

    changeItem(index: number, name: string, genre: string) {
        if (this.data) {
            this.data.itemListElement[index].item["name"] = name;
            this.data.itemListElement[index].item["genre"] = genre;
        }
    }
}

const moviesStore = new MoviesStore();
export default moviesStore;