import * as fs from 'fs';
import * as util from 'util';
import { v4 as uuid } from 'uuid';

import { AstraDB, Collection } from "@datastax/astra-db-ts";
import { CreateCollectionOptions, createCollectionOptionsKeys } from '@datastax/astra-db-ts/dist/client/operations/collections/create-collection';
import { SomeDoc, VectorDoc, InsertOneResult, InsertManyResult } from '@datastax/astra-db-ts/dist/client';

// Replace the below path with the path to your text file
export type Product = SomeDoc & {
    name: string;
    price: number;
};

export type ProductWithVector = Product & VectorDoc;

const generateRandomProductList = (numProducts: number): Product[] => {
    
    // Sample food names
    const foodNames = [
        "Apples", "Bananas", "Carrots", "Dates", "Eggs",
        "Fish", "Grapes", "Honey", "Ice Cream", "Jam",
        "Kale", "Lettuce", "Mangoes", "Nuts", "Oranges",
        "Pasta", "Quinoa", "Rice", "Spinach", "Tomatoes"
    ];

    // Function to generate a random price
    const getRandomPrice = (min: number, max: number): number => {
        return parseFloat((Math.random() * (max - min) + min).toFixed(2));
    };

    // Generate a list of products
    return Array.from({ length: numProducts }, (): Product => {
        const name = foodNames[Math.floor(Math.random() * foodNames.length)];
        const price = getRandomPrice(0.99, 9.99);
        return { name, price };
    });
};

async function main() {

    const ASTRA_DB_APPLICATION_TOKEN: string = process.env.ASTRA_DB_APPLICATION_TOKEN || '';
    const ASTRA_DB_API_ENDPOINT: string = process.env.ASTRA_DB_API_ENDPOINT|| '';
    const db: AstraDB = new AstraDB(ASTRA_DB_APPLICATION_TOKEN, ASTRA_DB_API_ENDPOINT);

    try {
        
        // Collections initializations (typed)
        const collection_simple: Collection = 
            await db.createCollection<Product>('collection_simple');
        
        // Inserting a simple 
        const p1: Product = generateRandomProductList(1)[0];
        p1._id="test";
        
        const resultOne: InsertOneResult = await collection_simple.insertOne(p1);
        console.log(resultOne.insertedId);

        const resultMany: InsertManyResult = await collection_simple.insertMany(generateRandomProductList(20));
        console.log(resultMany.insertedIds);

        const collection_vector: Collection = await db.createCollection<ProductWithVector>('collection_vector', {
            vector: {
                dimension: 1536,
                metric: 'cosine'
            }
        });
        
        collection_simple.findOne


    } catch (error) {
        console.error("An error occurred while computing embeddings:", error);
    }
}

async function workingWithVector() {
    

}

main().catch(error => console.error('Failed to run query:', error));
