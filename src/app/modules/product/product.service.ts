import { JwtPayload } from "jsonwebtoken";
import unlinkFile from "../../../shared/unlinkFile";
import QueryBuilder from "../../builder/QueryBuilder";
import { IProduct } from "./product.interface";
import { Product } from "./product.model";
import { Wislist } from "../wishlist/wishlist.model";
import { Subcategory } from "../subcategory/subcategory.model";
import ApiError from "../../../errors/ApiError";

const createProductToDB = async (payload:IProduct):Promise<IProduct | null>=>{
    const subcategory = await Subcategory.findById(payload.subcategory)
    if(!subcategory){
        throw new ApiError(404,"Subcategory not found")
    }
    payload.category = subcategory.category
    const result = await Product.create(payload)
    return result
}

const updateProductToDb = async (id:string,payload:Partial<IProduct>):Promise<IProduct | null>=>{
    const exist = await Product.findById(id)
    if(!exist){
        throw new Error("Product not found")
    }
    
    
    if(payload.subcategory){
        const subcategory = await Subcategory.findById(payload.subcategory)
        if(!subcategory){
            throw new ApiError(404,"Subcategory not found")
        }
        payload.category = subcategory.category
    }
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

const getAllProductToDb = async (query:Record<string,any>,user:JwtPayload)=>{
    if(query?.subcategory=="all"){
        delete query.subcategory
    }
    // await Product.updateMany({},{description:"This is a product description",subcategory:"687b7b2652139fe10e95f594"})
    const productQuery = new QueryBuilder(Product.find(),query).filter().search(['title']).sort().paginate()
    const [products,pagination] = await Promise.all([
        productQuery.modelQuery.select('title images price _id category quantity sizes subcategory description').populate('category','title').lean(),
        productQuery.getPaginationInfo()
    ])
    const modifiedProducts = await Promise.all(products.map(async (product:any)=>{
        // console.log(product,user);
        
        const isWishlisted = await Wislist.countDocuments({product:product._id,user:user?.id})
        // console.log(isWishlisted);
        
        return {...product,isWishlisted:isWishlisted?true:false}
    }))
    return {products:modifiedProducts,pagination}
}

const getSingleProduct = async (id:string,user:JwtPayload)=>{
    const isWishlisted = await Wislist.countDocuments({product:id,user:user?.id})
    const result = await Product.findById(id)
    return {...result?.toObject(),isWishlisted:isWishlisted?true:false}
}
export const ProductService = {
    createProductToDB,
    updateProductToDb,
    deleteProductToDb,
    getAllProductToDb,
    getSingleProduct
}