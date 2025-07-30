import { JwtPayload } from "jsonwebtoken";
import unlinkFile from "../../../shared/unlinkFile";
import QueryBuilder from "../../builder/QueryBuilder";
import { ICategory } from "./category.interface";
import { Category } from "./category.model";
import { USER_ROLES } from "../../../enums/user";
import { Subcategory } from "../subcategory/subcategory.model";

const createCategoryToDB = async (payload: ICategory): Promise<ICategory | null> => {
    console.log(payload);
    
  const result = await Category.create(payload);
  return result;
};

const updateCategoryToDB = async (
  id: string,
  payload: Partial<ICategory>
): Promise<ICategory | null> => {
    const isExist = await Category.findById(id);
    if (!isExist) {
      throw new Error("Category not found");
    }
    if(payload.image && isExist.image){
        unlinkFile(isExist.image)
        
    }
  const result = await Category.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return result;
};

const deleteCategoryToDB = async (id: string): Promise<ICategory | null> => {
    
  const result = await Category.findByIdAndUpdate(
    { _id: id },
    { status: "deleted" },
    { new: true }
  );
  return result;
};

const getAllCategoryToDB = async (query:Record<string,any>,user:JwtPayload)=>{
    const CategoryQuery = new QueryBuilder(Category.find({status:"active"}),query).filter().search(['title']).sort().paginate()

    const [categorys,pagination] = await Promise.all([
        CategoryQuery.modelQuery.lean(),
        CategoryQuery.getPaginationInfo()
    ])

    const cateGoryData = ![USER_ROLES.ADMIN,USER_ROLES.SUPER_ADMIN].includes(user.role) ? categorys : await Promise.all(categorys.map(async (category)=>{
      const subcategorys = await Subcategory.find({category:category._id}).lean()
      return {...category,subcategories:subcategorys}
    }))

    return {categorys:cateGoryData,pagination}
}


export const CategoryService = {
  createCategoryToDB,
  updateCategoryToDB,
  deleteCategoryToDB,
  getAllCategoryToDB
};