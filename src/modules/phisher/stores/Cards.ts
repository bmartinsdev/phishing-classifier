const getPokemon = async () => {
    const id = Math.round(Math.random() * (150 - 1) + 1);
    const res: any = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)).json();

    if (res.name) {
        const newCard: Pokemon = {
            name: res.name,
            id: res.id,
            sprite: res.sprites.front_default
        }
        return newCard;
    }
    return null;
}

function createCardStore() {
    return {
        getPokemon: async (): Promise<Pokemon | null> => {
            try {
                return await getPokemon();
            } catch (e) {
                console.log(e.message);
            }
        }
    };
}

export const CardStore = createCardStore();
export interface Card {
    title: string,
    description: string,
    image: string
}
export interface Pokemon {
    name: string,
    id: number,
    sprite: string
}