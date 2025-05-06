import { Client, Databases, Query, ID } from 'appwrite';
// import { query } from 'express';

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

//use appwrite SDK to check if the search term is in the db
//if it does update count
// if not create a new document with count +1
const client = new Client()
.setEndpoint('https://cloud.appwrite.io/v1')
.setProject(PROJECT_ID)

const database = new Databases(client);

const Appwrite = async(searchItem, movie) => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.equal('searchItem', searchItem)
            ])
            if(result.documents.length > 0){
                const doc = result.documents[0];
                await database.updateDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    doc.$id,
                    {
                        count: doc.count + 1
                    }
                )
            }else {
                await database.createDocument(
                    DATABASE_ID,
                    COLLECTION_ID,
                    ID.unique(),
                    {
                        searchItem: searchItem,
                        count: 1,
                        movie_id: movie.id,
                        poster_url: `hhttps://image.tmdb.org/t/p/w500${movie.poster_path}`,
                    }
                )
            }
        


    } catch (error) {
        console.log('Error fetching movies:', error);
    }

}

export default Appwrite;

export const getTopSearches = async () => {
    try {
        const result = await database.listDocuments(
            DATABASE_ID,
            COLLECTION_ID,
            [
                Query.limit(5),
                Query.orderDesc('count')
            ]
        )
        return result.documents;

    }catch (error) {
        console.log('Error fetching movies:', error);
    }
}
 