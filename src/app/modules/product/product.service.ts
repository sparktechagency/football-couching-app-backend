import unlinkFile from "../../../shared/unlinkFile";
import QueryBuilder from "../../builder/QueryBuilder";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";

const createProductToDB = async (payload:IProduct):Promise<IProduct | null>=>{
    const result = await Product.create(payload)
    return result
}

const updateProductToDb = async (id:string,payload:Partial<IProduct>):Promise<IProduct | null>=>{
    const exist = await Product.findById(id)
    if(!exist){
        throw new Error("Product not found")
    }
    let images = [...exist.images]
    if(payload.images && exist.images){
        for(let i = 0; i < payload.images.length; i++){
            if(payload.images[i]!==exist.images[i]){
                unlinkFile(exist.images[i])
                images[i] = payload.images[i]
                
            }

        }
    }
    payload.images = images
    const result = await Product.findByIdAndUpdate(id,payload,{new:true})
    return result
}

const deleteProductToDb = async (id:string):Promise<IProduct | null>=>{
    const exist = await Product.findById(id)
    if(!exist){
        throw new Error("Product not found")
    }
    if(exist.images){
        for(let i = 0; i < exist.images.length; i++){
            unlinkFile(exist.images[i])
        }
    }
    const result = await Product.findByIdAndDelete(id)
    return result
}

const getAllProductToDb = async (query:Record<string,any>)=>{
    const productQuery = new QueryBuilder(Product.find(),query).filter().search(['title','price']).sort().paginate()
    const [products,pagination] = await Promise.all([
        productQuery.modelQuery.lean(),
        productQuery.getPaginationInfo()
    ])
    return {products,pagination}
}
export const ProductService = {
    createProductToDB,
    updateProductToDb,
    deleteProductToDb,
    getAllProductToDb
}