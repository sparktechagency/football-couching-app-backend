import { JwtPayload } from "jsonwebtoken"
import QueryBuilder from "../../builder/QueryBuilder"
import { ISubCategory } from "./subcategory.interface"
import { Subcategory } from "./subcategory.model"
import { USER_ROLES } from "../../../enums/user"

const createSubCategoryToDB = async (payload:ISubCategory)=>{
    const result = await Subcategory.create(payload)
    return result
}

const deleteSubCategoryToDB = async (id:string)=>{
    const result = await Subcategory.findByIdAndDelete(id)
    return result
}
const updateSubCategoryToDB = async (id:string,payload:Partial<ISubCategory>)=>{
    const result = await Subcategory.findByIdAndUpdate(id,payload,{new:true})
    return result
}
const getAllSubCategoryToDB = async (query:Record<string,any>,user:JwtPayload)=>{
    const SubCategoryQuery = new QueryBuilder(Subcategory.find(),query).sort().paginate().filter()
    const [subCategories,pagination] = await Promise.all([
        SubCategoryQuery.modelQuery.lean(),
        SubCategoryQuery.getPaginationInfo()
    ])

    if(![USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN].includes(user?.role)){
            subCategories.unshift({
        _id:"all",
        //@ts-ignore
        name:"All"
    })
    }

    return {
        subCategories,
        pagination
    }
}
export const SubCategoryService = {
    createSubCategoryToDB,
    deleteSubCategoryToDB,
    updateSubCategoryToDB,
    getAllSubCategoryToDB
}